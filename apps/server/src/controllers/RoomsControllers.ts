import { RoomPrivacy } from "@pinturillo/shared/src/room";
import { PlayerSession } from "../domain/PlayerSession";
import { Room } from "../domain/Room";

export class RoomsControllers {
  private rooms: Map<string, Room> = new Map();

  addRoom(
    name: string,
    hostPlayer: PlayerSession,
    maximumPlayers: number,
    drawTime: number,
    totalGames: number,
    roundsPerGame: number,
    privacy: RoomPrivacy = RoomPrivacy.PUBLIC,
    password = "",
  ): Room {
    const room = new Room(name, hostPlayer, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password);

    return room;
  }

  joinRoom(roomId: string, session: PlayerSession) {
    let room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    // After joining the room, The class Room or RoomsController should broadcast that a new user have just joiner
    session.setRoom(room);

    return session;
  }

  leaveRoom(session: PlayerSession): { removedPlayerId: string; newHostId?: string; remainingSessions: PlayerSession[] } | null {
    const player = session.getPlayer();
    const data = player.getData();

    const room = session.leaveRoom();

    if (!room) return null;

    // If there is only one player, then erase the room
    const roomsPlayers = room.getPlayers();

    if (roomsPlayers?.length === 1) {
      const roomId = room?.getId();
      this.rooms.delete(roomId);

      // Then notify the last user that the room has been removed
      // HERE
      return {
        removedPlayerId: player.getData().id,
        remainingSessions: [],
      };
    }

    // If there are more than one player, remove the player and update the host if necessary
    return room?.leaveRoom(data.id);
  }
}

const roomsController = new RoomsControllers();
export default roomsController;
