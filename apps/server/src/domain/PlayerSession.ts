import type { Player } from "./Player";
import type { Room } from "./Room";

export class PlayerSession {
  private player: Player;
  private room: Room | null = null;

  constructor(player: Player, room?: Room) {
    this.player = player;

    if (room) {
      this.room = room;
    }
  }

  setRoom(room: Room) {
    this.room = room;
  }

  getPlayer(): Player {
    return this.player;
  }
}
