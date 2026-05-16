import type { Player } from "./Player";
import type { Room } from "./Room";

export class PlayerSession {
  private player: Player;
  private room: Room | null = null;
  private connectionId: string | null;

  constructor(player: Player, connectionId: string, room?: Room) {
    this.player = player;
    this.connectionId = connectionId;

    if (room) {
      this.room = room;
    }
  }

  getPlayer(): Player {
    return this.player;
  }

  getRoom() {
    return this.room;
  }

  getConnectionId() {
    return this.connectionId;
  }

  setRoom(room: Room) {
    this.room = room;
  }

  leaveRoom() {
    const room = this.room;
    this.room = null;

    return room;
  }
}
