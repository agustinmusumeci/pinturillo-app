import { PlayerSession } from "../domain/PlayerSession";
import { Room } from "../domain/Room";

export class RoomsControllers {
  private rooms: Map<string, Room> = new Map();

  joinRoom(roomId: string, session: PlayerSession) {
    let room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    // After joining the room, The class Room or RoomsController should broadcast that a new user have just joiner
    session.setRoom(room);

    return session;
  }
}

const roomsController = new RoomsControllers();
export default roomsController;
