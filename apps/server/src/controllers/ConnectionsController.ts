import type { WebSocket as WsWebSocket, WebSocketServer } from "ws";
import { Connection } from "../network/Connection";
import { randomUUID } from "node:crypto";
import { Events, WsEvent } from "@pinturillo/shared/src/events";
import { Player } from "../domain/Player";
import roomsController from "./RoomsControllers";
import { PlayerSession } from "../domain/PlayerSession";

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
            this.connections.get(connectionId)?.setSession(new PlayerSession(player, connectionId));

            ws.send(JSON.stringify({ event: Events.CREATE_PLAYER, success: true }));

            break;
          }

          // Create a room
          // Payload: {name: string, maximumPlayers: number, drawTime: number, totalGames: number, roundsPerGame: number, privacy: string, password: string}
          case Events.CREATE_ROOM: {
            const { name, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password } = payload;

            const connection = this.connections.get(connectionId);

            const hostPlayerSession = connection?.getSession();

            if (!hostPlayerSession) {
              // Send the NACK
              ws.send(JSON.stringify({ event: Events.CREATE_ROOM, success: false }));
              break;
            }

            roomsController.addRoom(name, hostPlayerSession, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password);

            //Send the ACK
            ws.send(JSON.stringify({ event: Events.CREATE_ROOM, success: true }));

            break;
          }

          // Join a room
          // Payload: {name: string, roomId: string}
          case Events.JOIN_ROOM: {
            const roomId = payload?.roomId;

            const connection = this.connections.get(connectionId);
            const session = connection?.getSession();

            if (!session || !roomId) {
              // Send the NACK
              ws.send(JSON.stringify({ event: Events.JOIN_ROOM, success: false }));
              break;
            }

            const response = this.roomsController.joinRoom(roomId, session);

            if (!response) {
              // Send the NACK
              ws.send(JSON.stringify({ event: Events.JOIN_ROOM, success: false }));
              break;
            }

            // Send the ACK
            ws.send(JSON.stringify({ event: Events.JOIN_ROOM, success: true }));

            // Broadcast to every connection on the room
            this.broadcast({ ...response, playerSessions: response.playerSessions.length }, response.playerSessions);

            break;
          }

          // Leave a room
          case Events.LEAVE_ROOM: {
            const conenction = this.connections.get(connectionId);

            const session = conenction?.getSession();

            if (!session || !conenction) break;

            const response = roomsController.leaveRoom(session);

            if (!response) {
              // Send the NACK
              ws.send(JSON.stringify({ event: Events.LEAVE_ROOM, success: false }));

              break;
            }

            const dataToBroadcast = { ...response, remainingSessions: response.remainingSessions.length };

            // Send the ACK
            ws.send(JSON.stringify({ event: Events.LEAVE_ROOM, success: true }));

            // Broadcast to every connection on the room
            this.broadcast(dataToBroadcast, response.remainingSessions);

            break;
          }
          
          case Events.START_GAME: {
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

  private broadcast(payload: any, hosts: PlayerSession[]) {
    for (const host of hosts) {
      const connectionId = host.getConnectionId();

      if (!connectionId) continue;

      const conn = this.connections.get(connectionId);

      conn?.send(payload);
    }
  }
}
