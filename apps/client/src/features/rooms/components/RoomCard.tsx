import { type RoomData } from "@pinturillo/shared/src/room";
import { NavLink, useLocation } from "react-router";

export default function RoomCard({ room }: { room: RoomData }) {
  const location = useLocation();

  return (
    <NavLink
      to={`${location.pathname}/${room.id}`}
      className="w-full flex flex-row items-center justify-between px-5 py-2 border border-gray-400 "
    >
      <div className="flex flex-row items-center gap-10">
        <span>
          {room.players}/{room.maximumPlayers}
        </span>
        <div>
          <p>{room.name}</p>
          <p>{room.hostPlayer}</p>
        </div>
      </div>
      <div>
        <span>{room.status.at(0) + room.status.toLocaleLowerCase().slice(1)}</span>
      </div>
    </NavLink>
  );
}
