import { useEffect, useState } from "react";
import { useSocket } from "../../shared/hooks/useSocket";
import RoomsList from "./components/RoomsList";
import type { RoomData } from "@pinturillo/shared/src/room";

export default function RoomsPage() {
  const { getRooms } = useSocket();
  const [rooms, setRooms] = useState<Array<RoomData>>([]);

  useEffect(() => {
    getRooms().then((res) => {
      setRooms(res);
    });
  }, [getRooms]);

  return (
    <section>
      <h2>Rooms</h2>
      <RoomsList rooms={rooms} />
    </section>
  );
}
