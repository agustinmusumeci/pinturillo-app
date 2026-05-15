import type { WebSocket as WsWebSocket } from "ws";
import { PlayerSession } from "../domain/PlayerSession";

export class Connection {
  private id: string;
  private session: PlayerSession | null = null;
  private ws: WsWebSocket;

  constructor(id: string, ws: WsWebSocket) {
    this.id = id;
    this.ws = ws;
  }

  setSession(session: PlayerSession) {
    this.session = session;
  }

  getSession(): PlayerSession | null {
    return this.session;
  }
}
