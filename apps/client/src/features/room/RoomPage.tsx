import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import PlayersList from "../players/PlayersList";

export default function RoomPage() {
  const location = useLocation();
  const { room } = location.state ?? null;
  const { id } = useParams();

  useEffect(() => {
    if (!room) {
      // If the room is empty, probably its a reconnect so fetch again the room data with the "id"
    }
  }, [room, id]);

  return (
    <section>
      <div className="flex flex-col">
        <span>{room?.name}</span>
        <span>
          {room?.players?.length}/{room?.maximumPlayers}
        </span>

        <span>{room?.hostPlayer}</span>

        <div>
          <span>Games: </span>
          <span>{room?.totalGames}</span>
        </div>
      </div>
      <PlayersList players={room?.players} />
    </section>
  );
}
