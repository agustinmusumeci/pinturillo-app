import type { RoomData } from "@pinturillo/shared/src/room";
import RoomCard from "./RoomCard";
import type { HandleJoinFn } from "../RoomsPage";

export default function RoomsList({ rooms, handleJoinRoom }: { rooms: Array<RoomData>; handleJoinRoom: HandleJoinFn }) {
  return (
    <div className="flex flex-col gap-5">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          handleJoinRoom={handleJoinRoom}
        />
      ))}
    </div>
  );
}
