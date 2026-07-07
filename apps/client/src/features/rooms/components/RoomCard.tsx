import { RoomPrivacy, type RoomData } from "@pinturillo/shared/src/room";
import { NavLink, useLocation } from "react-router";

export default function RoomCard({ room }: { room: RoomData }) {
  const location = useLocation();

  return (
    <NavLink
      to={room.privacy === RoomPrivacy.PUBLIC ? `${location.pathname}/${room.id}` : ""}
      className="w-full flex flex-row items-center justify-between px-5 py-2 border border-gray-400 "
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
    </NavLink>
  );
}
