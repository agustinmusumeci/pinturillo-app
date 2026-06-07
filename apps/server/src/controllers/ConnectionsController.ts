import type { WebSocket as WsWebSocket, WebSocketServer } from "ws";
import { Connection } from "../network/Connection";
import { randomUUID } from "node:crypto";
import { Events, WsPayload } from "@pinturillo/shared/src/events";
import { Player } from "../domain/Player";
import roomsController from "./RoomsControllers";
import { PlayerSession } from "../domain/PlayerSession";
import { GamesController } from "./GamesController";
import { SocketEventsHandler } from "../handlers/SocketEventsHandler";
import { MiddlewareFn } from "../types/middleware";
import { HeartbeatInterval } from "../constants/heartbeat";
import { Point } from "@pinturillo/shared/src/interfaces/point";

export class ConnectionsController {
  private wss: WebSocketServer;
  private connections: Map<string, Connection> = new Map();
  private roomsController = roomsController;
  private gamesController = new GamesController(this.broadcast);
  private eventsHandler = new SocketEventsHandler();

  constructor(wss: WebSocketServer) {
    this.wss = wss;

    wss.on("connection", (ws: WsWebSocket) => {
      const connectionId = randomUUID();
      const connection = this.addConnection(connectionId, ws);

      // Listen to events and define middleware execution order
      this.eventsHandler
        .on(Events.CREATE_PLAYER, [this.checkConnection, this.createPlayer])
        .on(Events.RECONNECT, [this.reconnect])
        .on(Events.CREATE_ROOM, [this.checkConnection, this.checkSession, this.createRoom])
        .on(Events.JOIN_ROOM, [this.checkConnection, this.checkSession, this.joinRoom])
        .on(Events.LEAVE_ROOM, [this.checkConnection, this.checkSession, this.leaveRoom])
        .on(Events.START_GAME, [this.checkConnection, this.checkSession, this.startGame])
        .on(Events.SELECT_WORD, [this.checkToken, this.checkConnection, this.checkSession, this.selectWord])
        .on(Events.DRAW, [this.checkToken, this.checkConnection, this.checkSession, this.draw])
        .on(Events.GUESS_WORD, [this.checkConnection, this.checkSession, this.guess]);

      ws.on("message", (payload) => {
        const parsedPayload = JSON.parse(payload.toString()) as WsPayload;

        this.eventsHandler.handle({ connection: connection, ws: ws, payload: parsedPayload });
      });

      ws.on("pong", () => {
        connection.setIsAlive(true);
      });

      ws.on("close", () => {
        this.removeConnection(connectionId);
      });
    });

    this.heartBeat();
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

  private reconnect: MiddlewareFn = (ctx) => {
    const connectionId = ctx.payload.data?.connectionId;

    this.connections.set(connectionId, ctx.connection);
  };

  private checkConnection: MiddlewareFn = (ctx, next) => {
    if (!ctx.connection) {
      ctx?.ws?.send(JSON.stringify({ event: ctx?.payload?.event, success: false, message: "There is no Connection associated." }));
      return;
    }

    next();
  };

  private checkSession: MiddlewareFn = (ctx, next) => {
    const session = ctx?.connection?.getSession();

    if (!session) {
      ctx?.ws?.send(JSON.stringify({ event: ctx?.payload?.event, success: false, message: "Session has not been initialized." }));
      return;
    }

    next({ session: session });
  };

  private checkToken: MiddlewareFn = (ctx, next) => {
    if (!ctx.payload?.data?.token) {
      ctx.ws.send(JSON.stringify({ event: Events.SELECT_WORD, success: false }));
      return;
    }

    next();
  };

  // Create a player and a player session after the socket connection is stablish
  // Payload: {name: string}
  private createPlayer: MiddlewareFn = (ctx) => {
    const playerName = ctx.payload?.data?.name;

    if (!playerName) {
      ctx.ws.send(JSON.stringify({ event: ctx.payload.event, success: false, data: { message: "The player name can not be empty" } }));
      return;
    }

    const player = new Player(playerName);

    const connection = ctx?.connection;
    const connectionId = ctx?.connection?.getId();

    // Add the player session to its socket connection
    connection?.setSession(new PlayerSession(player, connectionId));

    ctx.ws.send(JSON.stringify({ event: ctx?.payload?.event, success: true, data: { message: "Player created succesfully" } }));

    return;
  };

  // Payload: {name: string, maximumPlayers: number, drawTime: number, totalGames: number, roundsPerGame: number, privacy: string, password: string}
  private createRoom: MiddlewareFn = (ctx) => {
    const hostPlayerSession = ctx?.session;
    const { name, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password } = ctx?.payload?.data;

    roomsController.addRoom(name, hostPlayerSession, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password);

    //Send the ACK
    ctx?.ws?.send(JSON.stringify({ event: ctx?.payload?.event, success: true, data: { message: "Room created succesfully" } }));

    return;
  };

  // Payload: {name: string, roomId: string}
  private joinRoom: MiddlewareFn = (ctx) => {
    const session = ctx?.session;
    const roomId = ctx?.payload?.data?.roomId;

    const response = this.roomsController.joinRoom(roomId, session);

    if (!response) {
      // Send the NACK
      ctx.ws.send(JSON.stringify({ event: ctx.payload.event, success: false }));
      return;
    }

    // Send the ACK
    ctx.ws.send(JSON.stringify({ event: ctx.payload.event, success: true, data: { players: response.players } }));

    const broadcastData = {
      event: ctx.payload.event,
      success: true,
      data: { newPlayer: response.players.find((player) => player.id === response.newPlayerId) },
    };

    // Broadcast to every connection on the room
    this.broadcast(broadcastData, response.sessions);
  };

  private leaveRoom: MiddlewareFn = (ctx) => {
    const response = roomsController.leaveRoom(ctx?.session);

    if (!response) {
      // Send the NACK
      ctx.ws.send(JSON.stringify({ event: ctx.payload.event, success: false }));

      return;
    }

    // Send the ACK
    ctx.ws.send(JSON.stringify({ event: ctx.payload.event, success: true, data: { message: "Room leaved succesfully" } }));

    const broadcastData = {
      event: ctx.payload.event,
      success: true,
      data: { ...response, remainingSessions: response.remainingSessions.length },
    };

    // Broadcast to every connection on the room
    this.broadcast(broadcastData, response.remainingSessions);
  };

  private startGame: MiddlewareFn = (ctx) => {
    const response = roomsController.startRoomGame(ctx?.session);
    const sessions = roomsController.getSessions(ctx?.session);

    if (!response || !sessions) {
      ctx.ws.send(JSON.stringify({ event: ctx.payload.event, success: false }));
      return;
    }

    const game = response.game;

    this.gamesController.registerGameListener(game);

    const broadcastData = {
      event: ctx.payload.event,
      sucess: true,
      data: {
        gameId: response.gameId,
        drawTime: response.drawTime,
        totalRounds: response.totalRounds,
        players: response.players.map((session) => session.getPlayer().getData()),
      },
    };

    this.broadcast(broadcastData, sessions);

    game.startGame();
  };

  private selectWord: MiddlewareFn = (ctx) => {
    const gameId = this.roomsController.getGameId(ctx?.session) ?? "";
    const word = ctx?.payload?.data?.word;
    const emisionTimestamp = ctx?.payload?.data?.timestamp / 60;
    const currentTimestamp = Date.now() / 60;
    const token = ctx?.payload?.data?.token;

    this.gamesController.selectWord(gameId, word, emisionTimestamp, currentTimestamp, token);
  };

  private draw: MiddlewareFn = (ctx) => {
    const gameId = this.roomsController.getGameId(ctx?.session) ?? "";

    const token = ctx?.payload?.data?.token;
    const point = ctx?.payload?.data?.point as Point;

    this.gamesController.draw(gameId, point, token);
  };

  private guess: MiddlewareFn = (ctx) => {
    const session = ctx?.session;
    const gameId = this.roomsController.getGameId(session) ?? "";

    const guess = ctx?.payload?.data?.guess;

    this.gamesController.guess(gameId, guess, session);
  };

  broadcast(payload: any, hosts: PlayerSession[]) {
    for (const host of hosts) {
      const connectionId = host.getConnectionId();

      if (!connectionId) continue;

      const conn = this.connections.get(connectionId);

      conn?.send(payload);
    }
  }

  heartBeat() {
    return setInterval(() => {
      Object.values(this.connections).forEach((connection: Connection) => {
        const isAlive = connection.getIsAlive();

        if (!isAlive) {
          connection.disconnect();

          const session = connection.getSession();

          if (session) {
            this.roomsController.leaveRoom(session);
          }

          return;
        }

        connection.setIsAlive(false);
        connection.ping();
      });
    }, HeartbeatInterval);
  }
}
