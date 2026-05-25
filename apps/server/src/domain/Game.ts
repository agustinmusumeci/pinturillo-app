import { EventEmitter } from "node:events";
import { Player } from "./Player";
import { PlayerSession } from "./PlayerSession";
import { randomUUID, randomInt } from "node:crypto";
import { Events } from "@pinturillo/shared/src/events";
import { DefaultDrawTime, DefaultSelectTime, DrawOptions } from "@pinturillo/shared/src/constants";
import { Point } from "@pinturillo/shared/src/interfaces/point";
import { Guess } from "@pinturillo/shared/src/interfaces/guess";

export class Game extends EventEmitter {
  private id: string;
  private players: PlayerSession[];
  private pendingPlayers: PlayerSession[];
  private currentDrawer: PlayerSession | null;
  private currentToken: string;
  private drawTime: number;
  private words: string[];
  private optionWords: string[];
  private currentWord: string;
  private selectedWords: Set<string>;
  private currentRound: number;
  private totalRounds: number;
  private hasDrawnPlayers: { id: string; name: string }[];
  private board: Point[];
  private guesses: Guess[];
  private selectWordInterval: NodeJS.Timeout | null;
  private drawInterval: NodeJS.Timeout | null;
  private startDrawTimestamp: number | null;

  constructor(players: PlayerSession[], drawTime: number, totalRounds: number) {
    super();

    this.id = randomUUID();
    this.players = players;
    this.pendingPlayers = [];
    this.currentDrawer = null;
    this.currentToken = "";
    this.drawTime = drawTime;
    this.currentWord = "";
    this.words = [];
    this.optionWords = [];
    this.selectedWords = new Set();
    this.currentRound = 1;
    this.totalRounds = totalRounds;
    this.hasDrawnPlayers = [];
    this.board = [];
    this.guesses = [];
    this.selectWordInterval = null;
    this.drawInterval = null;
    this.startDrawTimestamp = null;
  }

  startGame() {
    // Set up game variables
    this.setUp();
  }

  setUp() {
    if (this.drawInterval) {
      clearInterval(this.drawInterval);
      this.drawInterval = null;
    }

    this.startDrawTimestamp = null;

    // Add the players that joined when a round was in process
    this.addPendingPlayers();

    // Clear the players "hasGuessed" var
    this.players.forEach((session) => {
      const player = session.getPlayer();

      player.setHasGuessed(false);
    });

    this.clearBoard();

    // Select the new drawer and pass round if all players had drawn
    this.selectDrawer();

    if (this.totalRounds >= this.currentRound) {
      // Broadcast that the game have just finished
      this.emit(Events.END_GAME, this.players, {});
    } else {
      this.selectWords();
      if (this.currentDrawer) {
        // Broadcast the new round
        this.emit(Events.START_ROUND, this.players, {
          currentRound: this.currentRound,
          drawTime: this.drawTime,
          currentDrawer: this.currentDrawer?.getPlayer().getData(),
        });

        // Emit to the drawer, the word options, timestamp of emition and token for validating
        this.currentToken = randomUUID();
        this.emit(Events.NOTIFY_DRAWER, [this.currentDrawer], { optionWords: this.optionWords, selectTime: DefaultSelectTime, timestamp: Date.now(), token: this.currentToken });
        this.handleSelectWordInterval();
      }
    }
  }

  private startRound() {
    this.handleDrawInterval();
  }

  private selectDrawer() {
    this.currentDrawer = null;

    for (let player of this.players) {
      const { id } = player.getPlayer().getData();

      const hasDraw = this.hasDrawnPlayers.find((player) => player.id === id);

      if (!hasDraw) {
        this.currentDrawer = player;
        this.hasDrawnPlayers.push(player.getPlayer().getData());

        return;
      }
    }

    // If we exit the loop, it means that we need to pass to the next round
    this.nextRound();
  }

  private selectWords() {
    // Empty optionWords
    this.optionWords = [];

    // Select "n" words
    for (let i = 1; i <= DrawOptions; i++) {
      const RNDWord = randomInt(0, this.words.length);
      const word = this.words[RNDWord];

      if (word === undefined) {
        continue;
      }

      // Remove the word from the pool
      this.words.splice(RNDWord, 1);

      // Add the word to the options and the selected ones
      this.optionWords.push(word);
      this.selectedWords.add(word);
    }
  }

  private addPendingPlayers() {
    for (let pendingPlayer of this.pendingPlayers) {
      this.players.push(pendingPlayer);
    }
  }

  private nextRound() {
    this.currentRound += 1;
  }

  draw(point: Point) {
    this.board.push(point);

    this.emit(Events.DRAW, this.players, { point: point });
  }

  guess(guess: Guess): { hasGuessed: boolean; score?: number } {
    const word = guess.word;

    if (word.toLowerCase() === this.currentWord.toLowerCase()) {
      const timestamp = guess.timestamp;
      const score = this.calculatePoints(timestamp);

      const player = this.players.find((player) => player.getPlayer().getData().id === guess.player.id)?.getPlayer();

      player?.addScore(score);
      player?.setHasGuessed(true);

      this.emit(Events.GUESS_WORD, this.players, { player: guess.player, score: score });

      return { hasGuessed: true, score: score };
    }

    return { hasGuessed: false };
  }

  // Define the points a player gets as the remaining time he has
  calculatePoints(timestamp: number) {
    if (!this.startDrawTimestamp) return 0;

    // Remaining time
    const timeDelta = (this.drawTime - (timestamp - this.startDrawTimestamp)) * 60;

    return timeDelta;
  }

  getToken(): string {
    return this.currentToken;
  }

  getCurrentDrawer() {
    return this.currentDrawer;
  }

  selectWord(word: string) {
    this.currentWord = word;

    if (this.selectWordInterval) {
      clearInterval(this.selectWordInterval);
      this.selectWordInterval = null;
    }

    this.emit(Events.START_DRAW, this.players, { drawTime: this.drawTime, wordLength: word.length });

    this.startDrawTimestamp = Date.now();

    this.startRound();
  }

  getId(): string {
    return this.id;
  }

  // If the player does not select a word in the stipulated time, the system select the first option as the word to draw
  selectWordTimeOut() {
    this.emit(Events.SELECT_TIMEOUT, this.players, { timeout: true });

    const automaticWord = this.optionWords.at(0);

    if (this.selectWordInterval) {
      clearInterval(this.selectWordInterval);
      this.selectWordInterval = null;
    }

    if (automaticWord) {
      this.selectWord(automaticWord);
    } else {
      this.setUp();
    }
  }

  clearBoard() {
    this.board = [];
  }

  addPlayer(session: PlayerSession, isPending: boolean) {
    if (isPending) {
      this.pendingPlayers.push(session);
    } else {
      this.players.push(session);
    }
  }

  removePlayer(playerId: string) {
    // Remove the player
    const newPlayers = this.players.filter((session) => {
      const player = session.getPlayer();
      const data = player.getData();

      if (data.id === playerId) {
        return false;
      } else {
        return true;
      }
    });

    this.players = newPlayers;
  }

  handleSelectWordInterval() {
    this.selectWordInterval = setInterval(() => {
      this.selectWordTimeOut();
    }, DefaultSelectTime);
  }

  handleDrawInterval() {
    this.drawInterval = setInterval(() => {
      this.setUp();
    }, DefaultDrawTime);
  }

  emit(event: Events, sessions: PlayerSession[], data: any): boolean {
    return super.emit(event, sessions, data);
  }

  on(event: Events, callback: (sessions: PlayerSession[], data: any) => void) {
    return super.on(event, callback);
  }
}
