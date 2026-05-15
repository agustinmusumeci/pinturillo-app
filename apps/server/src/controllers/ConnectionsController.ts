import type { WebSocket as WsWebSocket, WebSocketServer } from "ws";
import { Connection } from "../network/Connection";
import { randomUUID } from "node:crypto";
import { Events, WsEvent } from "@pinturillo/shared/src/events";
import { Player } from "../domain/Player";
import roomsController from "./RoomsControllers";
import { PlayerSession } from "../domain/PlayerSession";
import { Room } from "../domain/Room";

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
          // Create a player and a player session after the socket connection is stablish
          // Payload: {name: string}
          case Events.CREATE_PLAYER: {
            const playerName = payload?.name;

            const player = new Player(playerName);

            // Add the player session to its socket connection
            this.connections.get(connectionId)?.setSession(new PlayerSession(player));

            break;
          }

          // Create a room
          // Payload: {name: string, maximumPlayers: number, drawTime: number, totalGames: number, roundsPerGame: number, privacy: string, password: string}
          case Events.CREATE_ROOM: {
            const { name, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password } = payload;

            const connection = this.connections.get(connectionId);

            const hostPlayerSession = connection?.getSession();

            if (!hostPlayerSession) break;

            roomsController.addRoom(name, hostPlayerSession, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password);

            break;
          }

          // Joining a room
          // Payload: {name: string, roomId: string}
          case Events.JOIN_ROOM: {
            const roomId = payload?.roomId;

            if (!roomId) break;

            const connection = this.connections.get(connectionId);
            const session = connection?.getSession();

            if (!session) break;

            this.roomsController.joinRoom(roomId, session);

            break;
          }

          case Events.LEAVE_ROOM: {
            break;
          }

          default: {
            break;
          }
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
