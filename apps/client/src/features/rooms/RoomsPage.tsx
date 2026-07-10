import { useEffect, useState } from "react";
import { useSocket } from "../../shared/hooks/useSocket";
import RoomsList from "./components/RoomsList";
import { type RoomData, RoomPrivacy } from "@pinturillo/shared/src/room";
import { useLocation, useNavigate } from "react-router";

export type HandleJoinFn = (privacy: RoomPrivacy, roomId: string) => void;

export default function RoomsPage() {
  const { getRooms, joinRoom } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [rooms, setRooms] = useState<Array<RoomData>>([]);

  useEffect(() => {
    getRooms().then((res) => {
      setRooms(res);
    });
  }, [getRooms]);

  const handleJoinRoom: HandleJoinFn = (privacy, roomId) => {
    switch (privacy) {
      case RoomPrivacy.PRIVATE: {
        console.log("privado");
        break;
      }
      case RoomPrivacy.PUBLIC: {
        const roomRoute = `${location.pathname}/${roomId}`;

        joinRoom(roomId);

        navigate(roomRoute);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <section>
      <h2>Rooms</h2>
      <RoomsList
        rooms={rooms}
        handleJoinRoom={handleJoinRoom}
      />
    </section>
  );
}
