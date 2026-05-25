import { Events } from "@pinturillo/shared/src/events";
import { Game } from "../domain/Game";
import { PlayerSession } from "../domain/PlayerSession";
import { DefaultSelectTime } from "@pinturillo/shared/src/constants";
import { Point } from "@pinturillo/shared/src/interfaces/point";
import { Guess } from "@pinturillo/shared/src/interfaces/guess";

export class GamesController {
  private games: Map<string, Game> = new Map();
  private broadcast: (payload: any, sessions: PlayerSession[]) => void;

  constructor(broadcast: (payload: any, sessions: PlayerSession[]) => void) {
    this.broadcast = broadcast;
  }

  registerGameListener(game: Game) {
    this.games.set(game.getId(), game);

    game.on(
      Events.START_ROUND,
      (
        sessions: PlayerSession[],
        data: {
          currentRound: number;
          drawTime: number;
          currentDrawer: { id: string; name: string };
        },
      ) => {
        const payload = { event: Events.START_ROUND, data: data, success: true };

        this.broadcast(payload, sessions);
      },
    );

    game.on(Events.NOTIFY_DRAWER, (sessions: PlayerSession[], data: { optionWords: string[]; selectTime: number; timestamp: number; token: string }) => {
      const payload = { event: Events.NOTIFY_DRAWER, data: data, success: true };

      this.broadcast(payload, sessions);
    });

    game.on(Events.END_GAME, (sessions: PlayerSession[], data: {}) => {
      const payload = { event: Events.END_GAME, success: true };

      this.broadcast(payload, sessions);
    });

    game.on(Events.DRAW, (sessions: PlayerSession[], data: { point: Point }) => {
      const payload = { event: Events.DRAW, data: data, success: true };

      this.broadcast(payload, sessions);
    });

    game.on(Events.GUESS_WORD, (sessions: PlayerSession[], data: { player: { id: string; name: string }; score: number }) => {
      const payload = { event: Events.DRAW, data: data, success: true };

      this.broadcast(payload, sessions);
    });
  }

  selectWord(gameId: string, word: string, emisionTimestamp: number, currentTimestamp: number, token: string) {
    const game = this.games.get(gameId);

    if (!game) return false;

    // Check if the time taked to select a word is valid
    if (currentTimestamp - emisionTimestamp > DefaultSelectTime) {
      game.selectWordTimeOut();
      return false;
    }

    const gameToken = game.getToken();

    // Check if the user who sent the event is the currentDrawer
    if (gameToken !== token) {
      return false;
    }

    game.selectWord(word);

    return true;
  }

  draw(gameId: string, point: Point, token: string) {
    const game = this.games.get(gameId);

    if (!game) return false;

    const gameToken = game.getToken();

    // Check if the user who sent the event is the currentDrawer
    if (gameToken !== token) {
      return false;
    }

    game.draw(point);
  }

  guess(gameId: string, session: PlayerSession, word: string) {
    const game = this.games.get(gameId);

    if (!game) return false;

    const guess = {
      player: {
        id: session?.getPlayer()?.getData()?.id,
        name: session?.getPlayer()?.getData()?.name,
      },
      word: word,
      timestamp: Date.now(),
    } as Guess;

    game.guess(guess);
  }
}
