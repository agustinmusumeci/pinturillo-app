import type { WebSocket as WsWebSocket } from "ws";

export class Connection {
  private id: string;
  private ws: WsWebSocket;

  constructor(id: string, ws: WsWebSocket) {
    this.id = id;
    this.ws = ws;
  }
}
