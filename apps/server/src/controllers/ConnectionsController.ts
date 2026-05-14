import type { WebSocket as WsWebSocket, WebSocketServer } from "ws";
import { Connection } from "../network/Connection";
import { randomUUID } from "node:crypto";
import { Events, WsEvent } from "@pinturillo/shared/src/events";
import { Player } from "../domain/Player";
import roomsController from "./RoomsControllers";

export class ConnectionsController {
  private wss: WebSocketServer;
  private connections: Map<string, Connection> = new Map();
  private roomsController = roomsController;

  constructor(wss: WebSocketServer) {
    this.wss = wss;

    wss.on("connection", (ws: WsWebSocket) => {
      const connectionId = randomUUID();
      this.addConnection(connectionId, ws);

      ws.on("message", (data) => {
        const { event, payload } = JSON.parse(data.toString()) as WsEvent;

        switch (event) {
          case Events.CREATE_ROOM:
            break;

          // Joining a room
          // Payload: {name: string, roomId: string}
          case Events.JOIN_ROOM:
            const playerName = payload?.name;
            const roomId = payload?.roomId;

            if (!roomId || !playerName) return;

            const player = new Player(playerName);

            const session = this.roomsController.joinRoom(roomId, player);

            if (!session) return;

            const connection = this.connections.get(connectionId);

            connection?.setSession(session);

            break;

          case Events.LEAVE_ROOM:
            break;

          default:
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
