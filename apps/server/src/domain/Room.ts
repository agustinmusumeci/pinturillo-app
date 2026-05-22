import { RoomPrivacy, RoomStatus } from "@pinturillo/shared/src/room";
import type { RoomPrivacy as RoomPrivacyType, RoomStatus as RoomStatusType } from "@pinturillo/shared/src/room";
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

  getId(): string {
    return this.id;
  }

  getHostPlayer(): PlayerSession {
    return this.hostPlayer;
  }

  getPlayers(): PlayerSession[] {
    return this.playerSessions;
  }

  joinRoom(session: PlayerSession) {
    this.playerSessions.push(session);
  }

  leaveRoom(playerId: string): { removedPlayerId: string; hostPlayerId?: string; remainingSessions: PlayerSession[] } {
    let response: { removedPlayerId: string; hostPlayerId?: string; remainingSessions: PlayerSession[] } = {
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

    return response;
  }

  createGame(): { game: Game; gameId: string; drawTime: number; totalRounds: number; players: PlayerSession[] } | null {
    const game = new Game(this.playerSessions, this.drawTime, this.roundsPerGame);

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
