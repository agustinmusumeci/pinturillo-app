import type { WebSocket as WsWebSocket, WebSocketServer } from "ws";
import { Connection } from "../network/Connection";
import { randomUUID } from "node:crypto";

export class ConnectionController {
  private wss: WebSocketServer;
  private connections: Map<string, Connection> = new Map();

  constructor(wss: WebSocketServer) {
    this.wss = wss;

    wss.on("connection", (ws: WsWebSocket) => {
      const connectionId = randomUUID();
      this.addConnection(connectionId, ws);

      ws.on("close", () => {
        this.removeConnection(connectionId);
      });
    });
  }

  private addConnection(connectionId: string, ws: WsWebSocket): Connection {
    const connection = new Connection(connectionId, ws);

    this.connections.set(connectionId, connection);

    ws.send(JSON.stringify({ message: "Web socket connected succesfully 🚀" }));

    return connection;
  }

  private removeConnection(connectionId: string): Boolean {
    return this.connections.delete(connectionId);
  }
}
