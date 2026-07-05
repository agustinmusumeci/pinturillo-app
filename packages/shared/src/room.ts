export interface RoomData {
  id: string;
  name: string;
  hostPlayer: string;
  maximumPlayers: number;
  totalGames: number;
  privacy: RoomPrivacy;
  status: RoomStatus;
  players: number;
}

export enum RoomPrivacy {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum RoomStatus {
  CREATED = "CREATED",
  PLAYING = "PLAYING",
}
