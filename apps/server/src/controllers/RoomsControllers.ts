import { Player } from "../domain/Player";
import { PlayerSession } from "../domain/PlayerSession";
import { Room } from "../domain/Room";

export class RoomsControllers {
  private rooms: Map<string, Room> = new Map();

  joinRoom(roomId: string, player: Player): PlayerSession | null {
    let room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    const session = new PlayerSession(player, room);

    return session;
  }
}

const roomsController = new RoomsControllers();
export default roomsController;
