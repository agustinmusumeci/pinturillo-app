import { useRef, type ReactNode } from "react";
import { SocketContext } from "./SocketContext";
import { Socket } from "../../socket/Socket";
import { SOCKET_URL } from "../../constants/url";
import { Events, type WsPayload } from "@pinturillo/shared/src/events";
import { type RoomData } from "@pinturillo/shared/src/room";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const isSocketConnected = () => {
    if (!socketRef.current) {
      return false;
    }

    return true;
  };

  const createPlayer = async (name: string): Promise<boolean> => {
    if (!name) return false;

    if (!socketRef.current) {
      socketRef.current = new Socket(SOCKET_URL, (payload) => {
        console.info("Socket connected received:", payload);
      });
    }

    const payload: WsPayload = { event: Events.CREATE_PLAYER, data: { name: name } };
    const res = await socketRef.current.request(payload);

    return res?.success;
  };

  const getRooms = async (): Promise<Array<RoomData>> => {
    const payload: WsPayload = { event: Events.GET_ROOMS };
    const res = await socketRef!.current!.request(payload);

    const rooms = res?.data?.rooms ?? [];

    return rooms;
  };

  return <SocketContext.Provider value={{ isSocketConnected, createPlayer, getRooms }}>{children}</SocketContext.Provider>;
};
