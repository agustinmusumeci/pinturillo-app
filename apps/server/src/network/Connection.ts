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
  getSession(): PlayerSession | null {
    return this.session;
  }

  getId(): string {
    return this.id;
  }

  send(data: any) {
    this.ws.send(data);
  }

  setSession(session: PlayerSession) {
    this.session = session;
  }
}
