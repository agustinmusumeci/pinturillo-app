import type { RoomData } from "@pinturillo/shared/src/room";
import RoomCard from "./RoomCard";

export default function RoomsList({ rooms }: { rooms: Array<RoomData> }) {
  return (
    <div className="flex flex-col gap-5">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
        />
      ))}
    </div>
  );
}
