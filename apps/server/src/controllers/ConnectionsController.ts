import type { WebSocket as WsWebSocket, WebSocketServer } from "ws";
import { Connection } from "../network/Connection";
import { randomUUID } from "node:crypto";
import { Events, WsEvent } from "../../../../packages/shared/src/events";
import { Player } from "../domain/Player";
import { RoomsControllers } from "./RoomsControllers";

export class ConnectionController {
  private wss: WebSocketServer;
  private connections: Map<string, Connection> = new Map();
  private roomsController = new RoomsControllers();

  constructor(wss: WebSocketServer) {
    this.wss = wss;

    wss.on("connection", (ws: WsWebSocket) => {
      const connectionId = randomUUID();
      this.addConnection(connectionId, ws);

      ws.on("message", (data) => {
        const { event, payload } = JSON.parse(data.toString()) as WsEvent;

        switch (event) {
          case Events.JOIN_ROOM:
            const playerName = payload?.name;
            const roomId = payload?.roomId;

            const player = new Player(playerName);

            const session = this.roomsController.joinRoom(roomId, player);

            const connection = this.connections.get(connectionId);

            connection?.setSession(session);

            break;

          case Events.LEAVE_ROOM:
            break;
        }
      });

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
