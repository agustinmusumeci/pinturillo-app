import { RoomPrivacy } from "@pinturillo/shared/src/room";
import { Player } from "../domain/Player";
import { PlayerSession } from "../domain/PlayerSession";
import { Room } from "../domain/Room";

const createSession = (name: string, connectionId: string): PlayerSession => {
  const player = new Player(name);

  return new PlayerSession(player, connectionId);
};

const createTestRoom = (
  name: string,
  hostName: string,
  maximumPlayers: number,
  drawTime: number,
  totalGames: number,
  roundsPerGame: number,
  privacy: RoomPrivacy = RoomPrivacy.PUBLIC,
  password: string | null = null,
  withActiveGame = false,
): Room => {
  const host = createSession(hostName, `${hostName.toLowerCase()}-socket`);
  const room = new Room(name, host, maximumPlayers, drawTime, totalGames, roundsPerGame, privacy, password);

  const extraPlayers = [createSession(`${hostName} Jr`, `${hostName.toLowerCase()}-socket-2`), createSession(`Invitado`, `${hostName.toLowerCase()}-socket-3`)];

  extraPlayers.forEach((playerSession) => room.joinRoom(playerSession));
  if (withActiveGame) {
    room.createGame();
  }
  return room;
};

export const createTestRooms = (): Map<string, Room> => {
  const roomOne = createTestRoom("Sala de prueba 1", "Ana", 4, 45, 3, 2, RoomPrivacy.PUBLIC, null, true);
  const roomTwo = createTestRoom("Sala privada", "Luis", 6, 60, 5, 3, RoomPrivacy.PRIVATE, "1234");
  const roomThree = createTestRoom("Sala rápida", "Marta", 2, 30, 1, 1, RoomPrivacy.PUBLIC, null, true);

  return new Map<string, Room>([
    [roomOne.getId(), roomOne],
    [roomTwo.getId(), roomTwo],
    [roomThree.getId(), roomThree],
  ]);
};
