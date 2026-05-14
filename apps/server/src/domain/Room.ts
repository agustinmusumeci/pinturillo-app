import { RoomPrivacy, RoomStatus } from "@pinturillo/shared/src/room";
import type { RoomPrivacy as RoomPrivacyType, RoomStatus as RoomStatusType } from "@pinturillo/shared/src/room";
import { Game } from "./Game";
import { Player } from "./Player";
import { PlayerSession } from "./PlayerSession";
import { randomUUID } from "node:crypto";

export class Room {
  private id: string;
  private hostPlayer: Player;
  private maximumPlayers: number;
  private drawTime: number;
  private totalRounds: number;
  private playerSessions: PlayerSession[] = [];
  private currentGame: Game | null = null;
  private status: RoomStatusType;
  private privacy: RoomPrivacyType;

  constructor(hostPlayer: Player, maximumPlayers: number, drawTime: number, totalRounds: number, privacy: RoomPrivacyType) {
    this.id = randomUUID();
    this.hostPlayer = hostPlayer;
    this.maximumPlayers = maximumPlayers;
    this.drawTime = drawTime;
    this.totalRounds = totalRounds;
    this.status = RoomStatus.CREATED;
    this.privacy = privacy;
  }
}
