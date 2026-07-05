import RoomCard from "./RoomCard";

export default function RoomsList({ rooms }: { rooms: Array<string> }) {
  return (
    <div>
      {rooms.map((room, i) => (
        <RoomCard
          key={i}
          room={room}
        />
      ))}
    </div>
  );
}
