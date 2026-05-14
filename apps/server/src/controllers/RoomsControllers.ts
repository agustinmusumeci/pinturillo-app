import { Player } from "../domain/Player";
import { PlayerSession } from "../domain/PlayerSession";
import { Room } from "../domain/Room";

export class RoomsControllers {
  private rooms: Map<string, Room> = new Map();

  joinRoom(roomId: string, player: Player): PlayerSession {
    let room = this.rooms.get(roomId);

    if (!room) {
      room = new Room();
      this.rooms.set(roomId, room);
    }

    const session = new PlayerSession(player, room);

    return session;
  }
}
