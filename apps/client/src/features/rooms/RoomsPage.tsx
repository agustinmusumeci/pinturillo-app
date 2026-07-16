import { useEffect, useState } from "react";
import { useSocket } from "../../shared/hooks/useSocket";
import RoomsList from "./components/RoomsList";
import { type RoomData, RoomPrivacy, RoomStatus } from "@pinturillo/shared/src/room";
import { useLocation, useNavigate } from "react-router";
import RoomPasswordModal from "./components/RoomPasswordModal";
import type { PlayerData } from "@pinturillo/shared/src/players";

export type HandleJoinFn = (privacy: RoomPrivacy, roomId: string) => void;
export type HandleJoinWithPasswordFn = (password: string) => void;

export default function RoomsPage() {
  const { getRooms, joinRoom } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<null | RoomData>(null);
  const [rooms, setRooms] = useState<Array<RoomData>>([]);

  useEffect(() => {
    getRooms().then((res) => {
      setRooms(res);
    });
  }, [getRooms]);

  const handleJoinRoom: HandleJoinFn = async (privacy, roomId) => {
    const room = rooms.find((room) => room.id === roomId) ?? null;
    setSelectedRoomId(roomId);
    setSelectedRoom(room);

    switch (privacy) {
      case RoomPrivacy.PRIVATE: {
        // Triggers a modal that executes "handleJoinWithPassword" after password is inserted
        setIsPasswordRequired(true);

        break;
      }
      case RoomPrivacy.PUBLIC: {
        const roomRoute = `${location.pathname}/${roomId}`;

        const res = await joinRoom(roomId);

        if (res?.success && room) {
          const parsedRoom = parseRoom(room, res?.data?.players);

          navigate(roomRoute, { state: { room: parsedRoom } });

          break;
        }

        // TODO: If the res is not OK, show a modal with the respective message

        break;
      }

      default: {
        break;
      }
    }
  };

  const handleJoinWithPassword: HandleJoinWithPasswordFn = async (password) => {
    const roomId = selectedRoomId;

    if (!roomId) {
      return;
    }

    const res = await joinRoom(roomId, password);

    if (res?.success && selectedRoom) {
      const parsedRoom = parseRoom(selectedRoom, res?.data?.players);

      console.log("ROOM: ", parsedRoom);

      navigate(`${location.pathname}/${roomId}`, { state: { room: parsedRoom } });

      return;
    }

    // TODO: If the res is not OK, show a modal with the respective message
  };

  const handleCancelPassword = () => {
    setIsPasswordRequired(false);
  };

  const parseRoom = (room: RoomData, players: Array<PlayerData> = []) => {
    return {
      id: room.id,
      name: room.name,
      hostPlayer: room.hostPlayer,
      maximumPlayers: room.maximumPlayers,
      players: players,
      status: room.status ?? RoomStatus.CREATED,
      totalGames: room.totalGames ?? 0,
      privacy: room.privacy,
    };
  };

  return (
    <section>
      <h2>Rooms</h2>
      <RoomsList
        rooms={rooms}
        handleJoinRoom={handleJoinRoom}
      />

      <RoomPasswordModal
        active={isPasswordRequired}
        handlePasswordSubmit={handleJoinWithPassword}
        handleCancelPassword={handleCancelPassword}
      />
    </section>
  );
}
