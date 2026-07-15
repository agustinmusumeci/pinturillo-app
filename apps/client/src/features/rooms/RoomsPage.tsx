import { useEffect, useState } from "react";
import { useSocket } from "../../shared/hooks/useSocket";
import RoomsList from "./components/RoomsList";
import { type RoomData, RoomPrivacy } from "@pinturillo/shared/src/room";
import { useLocation, useNavigate } from "react-router";
import RoomPasswordModal from "./components/RoomPasswordModal";

export type HandleJoinFn = (privacy: RoomPrivacy, roomId: string) => void;
export type HandleJoinWithPasswordFn = (password: string) => void;

export default function RoomsPage() {
  const { getRooms, joinRoom } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [rooms, setRooms] = useState<Array<RoomData>>([]);

  useEffect(() => {
    getRooms().then((res) => {
      setRooms(res);
    });
  }, [getRooms]);

  const handleJoinRoom: HandleJoinFn = async (privacy, roomId) => {
    setSelectedRoomId(roomId);

    switch (privacy) {
      case RoomPrivacy.PRIVATE: {
        // Triggers a modal that executes "handleJoinWithPassword" after password is inserted
        setIsPasswordRequired(true);

        break;
      }
      case RoomPrivacy.PUBLIC: {
        const roomRoute = `${location.pathname}/${roomId}`;

        const res = await joinRoom(roomId);

        if (res?.success) {
          navigate(roomRoute);

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

    if (res?.success) {
      navigate(`${location.pathname}/${roomId}`);

      return;
    }

    // TODO: If the res is not OK, show a modal with the respective message
  };

  const handleCancelPassword = () => {
    setIsPasswordRequired(false);
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
