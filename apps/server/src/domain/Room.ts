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
  private password: string | undefined;

  constructor(
    name: string = "",
    hostPlayer: PlayerSession,
    maximumPlayers: number = MaximumPlayers,
    drawTime: number = DefaultDrawTime,
    totalGames: number = MaximumTotalGames,
    roundsPerGame: number = MaximumTotalRounds,
    privacy: RoomPrivacyType = RoomPrivacy.PUBLIC,
    password: string | undefined,
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
}
