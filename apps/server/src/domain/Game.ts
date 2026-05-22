import { EventEmitter } from "node:events";
import { Guess } from "./Guess";
import { Player } from "./Player";
import { PlayerSession } from "./PlayerSession";
import { Trace } from "./Trace";
import { randomUUID, randomInt } from "node:crypto";
import { Events } from "@pinturillo/shared/src/events";
import { DefaultSelectTime, DrawOptions } from "@pinturillo/shared/src/constants";

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
  private board: Trace[];
  private guesses: Guess[];

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
  }

  startGame() {
    // Set up game variables
    this.setUpRound();
  }

  private setUpRound() {
    // Add the pending to join players
    this.addPendingPlayers();

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
      }
    }
  }

  private selectDrawer() {
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

  getToken(): string {
    return this.currentToken;
  }

  selectWord(word: string) {
    this.currentWord = word;

    this.emit(Events.START_DRAW, this.players, { start: true });
  }

  getId(): string {
    return this.id;
  }

  timeOut() {
    this.emit(Events.SELECT_TIMEOUT, this.players, { timeout: true });

    this.setUpRound();
  }

  emit(event: Events, sessions: PlayerSession[], payload: any): boolean {
    return super.emit(event, sessions, payload);
  }

  on(event: Events, callback: (sessions: PlayerSession[], payload: any) => void) {
    return super.on(event, callback);
  }
}
