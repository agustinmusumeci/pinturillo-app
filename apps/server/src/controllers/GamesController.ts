import { Events } from "@pinturillo/shared/src/events";
import { Game } from "../domain/Game";
import { PlayerSession } from "../domain/PlayerSession";
import { DefaultSelectTime } from "@pinturillo/shared/src/constants";

export class GamesController {
  private games: Map<string, Game> = new Map();
  private broadcast: (payload: any, sessions: PlayerSession[]) => void;

  constructor(broadcast: (payload: any, sessions: PlayerSession[]) => void) {
    this.broadcast = broadcast;
  }

  registerGameListener(game: Game) {
    this.games.set(game.getId(), game);

    game.on(Events.START_ROUND, (sessions: PlayerSession[], data: any) => {
      const payload = { event: Events.START_ROUND, data: data, success: true };

      this.broadcast(payload, sessions);
    });
  }

  selectWord(gameId: string, word: string, emisionTimestamp: number, currentTimestamp: number, token: string) {
    const game = this.games.get(gameId);

    if (!game) return null;

    // Check if the time taked to select a word is valid
    if (currentTimestamp - emisionTimestamp > DefaultSelectTime) {
      game.timeOut();
      return null;
    }

    const gameToken = game.getToken();

    // Check if the user who sent the event is the currentDrawer
    if (gameToken !== token) {
      return null;
    }

    game.selectWord(word);

    return true;
  }
}
