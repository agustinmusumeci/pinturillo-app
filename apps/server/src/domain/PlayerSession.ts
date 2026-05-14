import type { Player } from "./Player";
import type { Room } from "./Room";

export class PlayerSession {
  private player: Player;
  private room: Room;

  constructor(player: Player, room: Room) {
    this.player = player;
    this.room = room;
  }
}
