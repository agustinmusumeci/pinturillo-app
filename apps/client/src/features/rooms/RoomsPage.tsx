import { useEffect, useState } from "react";
import { useSocket } from "../../shared/hooks/useSocket";
import RoomsList from "./components/RoomsList";

export default function RoomsPage() {
  const { getRooms } = useSocket();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms()
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [getRooms]);

  return (
    <section>
      <h2>Rooms</h2>
      <RoomsList rooms={rooms} />
    </section>
  );
}
