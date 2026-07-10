import { type RoomData } from "@pinturillo/shared/src/room";
import type { HandleJoinFn } from "../RoomsPage";

export default function RoomCard({ room, handleJoinRoom }: { room: RoomData; handleJoinRoom: HandleJoinFn }) {
  return (
    <div
      className="w-full flex flex-row items-center justify-between px-5 py-2 border border-gray-400 cursor-pointer"
      onClick={() => {
        handleJoinRoom(room.privacy, room.id);
      }}
    >
      <div className="flex flex-row items-center gap-10">
        <div>
          <span>
            {room.players}/{room.maximumPlayers}
          </span>
        </div>
        <div>
          <span>{room.privacy.at(0) + room.privacy.toLocaleLowerCase().slice(1)}</span>
        </div>
        <div>
          <p>{room.name}</p>
          <p>{room.hostPlayer}</p>
        </div>
      </div>
      <div>
        <span>{room.status.at(0) + room.status.toLocaleLowerCase().slice(1)}</span>
      </div>
    </div>
  );
}
