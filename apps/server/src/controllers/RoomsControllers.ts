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

  joinRoom(roomId: string, session: PlayerSession): { newPlayerId: string; playerSessions: PlayerSession[] } | null {
    let room = this.rooms.get(roomId);

    if (!room) {
      return null;
    }

    session.setRoom(room);
    const playerSessions = room.getPlayers();
    room.joinRoom(session);

    let response = {
      newPlayerId: session.getPlayer().getData().id,
      playerSessions: playerSessions,
    };

    return response;
  }

  leaveRoom(session: PlayerSession): { removedPlayerId: string; newHostId?: string; remainingSessions: PlayerSession[]; newDrawerPlayerId?: string } | null {
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

  startRoomGame(session: PlayerSession) {
    const room = session.getRoom();

    if (!room) return null;

    const gameData = room.createGame();

    return gameData;
  }

  getSessions(session: PlayerSession) {
    const room = session.getRoom();

    if (!room) return null;

    const sessions = room.getPlayers();

    return sessions;
  }

  getGameId(session: PlayerSession) {
    const room = session.getRoom();

    if (!room) return null;

    room.getGameId();
  }
}

const roomsController = new RoomsControllers();
export default roomsController;
