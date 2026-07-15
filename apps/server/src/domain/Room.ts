import { RoomPrivacy, RoomStatus } from "@pinturillo/shared/src/room";
import type { RoomData, RoomPrivacy as RoomPrivacyType, RoomStatus as RoomStatusType } from "@pinturillo/shared/src/room";
import { Game } from "./Game";
import { PlayerSession } from "./PlayerSession";
import { randomUUID } from "node:crypto";
import { DefaultDrawTime, MaximumPlayers, MaximumTotalGames, MaximumTotalRounds } from "@pinturillo/shared/src/constants";

export class Room {
  private id: string;
  private name: string;
  private hostPlayer: PlayerSession;
  private maximumPlayers: number;
  private drawTime: number;
  private totalGames: number;
  private roundsPerGame: number;
  private playerSessions: PlayerSession[] = [];
  private currentGame: Game | null = null;
  private status: RoomStatusType;
  private privacy: RoomPrivacyType;
  private password: string | null = null;

  constructor(
    name: string = "",
    hostPlayer: PlayerSession,
    maximumPlayers: number = MaximumPlayers,
    drawTime: number = DefaultDrawTime,
    totalGames: number = MaximumTotalGames,
    roundsPerGame: number = MaximumTotalRounds,
    privacy: RoomPrivacyType = RoomPrivacy.PUBLIC,
    password: string | null,
  ) {
    this.id = randomUUID();
    this.name = name;
    this.hostPlayer = hostPlayer;
    this.maximumPlayers = maximumPlayers;
    this.drawTime = drawTime;
    this.totalGames = totalGames;
    this.roundsPerGame = roundsPerGame;
    this.status = RoomStatus.CREATED;
    this.privacy = privacy;

    this.playerSessions.push(hostPlayer);

    if (privacy === RoomPrivacy.PRIVATE) {
      this.password = password;
    }
  }

  roomJSON(): RoomData {
    const room = {
      id: this.id,
      name: this.name,
      hostPlayer: this.hostPlayer.getPlayer().getData().name,
      maximumPlayers: this.maximumPlayers,
      totalGames: this.totalGames,
      privacy: this.privacy,
      status: this.status,
      players: this.playerSessions.length,
    };

    return room;
  }

  getId(): string {
    return this.id;
  }

  getHostPlayer(): PlayerSession {
    return this.hostPlayer;
  }

  getMaximumPlayers(): number {
    return this.maximumPlayers;
  }

  getPlayers(): PlayerSession[] {
    return this.playerSessions;
  }

  getPrivacy(): RoomPrivacy {
    return this.privacy;
  }

  checkPassword(password: string): Boolean {
    if (password === this.password) return true;

    return false;
  }

  joinRoom(session: PlayerSession, password?: string): { success: boolean; message: string } {
    if (this.playerSessions.length + 1 > this.maximumPlayers) {
      return {
        success: false,
        message: "The room is full.",
      };
    }

    const privacy = this.getPrivacy();

    if (privacy === RoomPrivacy.PRIVATE) {
      if (!password)
        return {
          success: false,
          message: "The password can not be empty.",
        };

      const isPasswordValid = this.checkPassword(password);

      if (!isPasswordValid)
        return {
          success: false,
          message: "Password is incorrect.",
        };
    }

    this.playerSessions.push(session);

    if (this.currentGame) {
      if (this.status === RoomStatus.CREATED) {
        this.currentGame.addPlayer(session, false);
      } else {
        this.currentGame.addPlayer(session, true);
      }
    }

    return { success: true, message: "Player joined successfuly" };
  }

  leaveRoom(playerId: string): { removedPlayerId: string; hostPlayerId?: string; remainingSessions: PlayerSession[]; newDrawerPlayerId?: string } {
    let response: { removedPlayerId: string; hostPlayerId?: string; remainingSessions: PlayerSession[]; newDrawerPlayerId?: string } = {
      removedPlayerId: playerId,
      remainingSessions: [],
    };

    // Remove the player
    const filteredPlayerSessiones = this.playerSessions.filter((session) => {
      const player = session.getPlayer();
      const data = player.getData();

      if (data.id === playerId) {
        return false;
      } else {
        return true;
      }
    });

    this.playerSessions = filteredPlayerSessiones;
    response["remainingSessions"] = filteredPlayerSessiones;

    // If the player that leaves is the host, select a new host
    const host = this.hostPlayer.getPlayer().getData();

    if (host.id === playerId && this.playerSessions.length > 0) {
      const newHost = this.playerSessions[0];

      if (newHost) {
        this.hostPlayer = newHost;
        response["hostPlayerId"] = newHost.getPlayer().getData().id;
      }
    }

    // If the game is in process and the player that leave is the drawer, select a new drawer
    if (this.currentGame) {
      const game = this.currentGame;

      const currentDrawer = game.getCurrentDrawer();

      if (currentDrawer && currentDrawer.getPlayer().getData().id === playerId) {
        // Update the players and set up the round
        game.removePlayer(playerId);
        game.setUp();

        response["newDrawerPlayerId"] = playerId;
      }
    }

    return response;
  }

  createGame(): { game: Game; gameId: string; drawTime: number; totalRounds: number; players: PlayerSession[] } | null {
    const game = new Game(this.playerSessions, this.drawTime, this.roundsPerGame);

    this.status = RoomStatus.PLAYING;
    this.currentGame = game;

    return {
      game: game,
      gameId: game.getId(),
      drawTime: this.drawTime,
      totalRounds: this.roundsPerGame,
      players: this.playerSessions,
    };
  }

  getGameId() {
    return this.currentGame?.getId();
  }
}
