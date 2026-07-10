import { useRef, type ReactNode } from "react";
import { SocketContext } from "./SocketContext";
import { Socket } from "../../lib/socket/Socket";
import { SOCKET_URL } from "../../constants/url";
import { Events, type WsPayload } from "@pinturillo/shared/src/events";
import { type RoomData } from "@pinturillo/shared/src/room";
import { CONNECTION_STORAGE_KEY } from "../../constants/storage";
import storage from "../../lib/storage/Storage";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const startSocket = async () => {
    socketRef.current = new Socket(SOCKET_URL, (payload) => {
      console.info("Socket connected received:", payload);
    });
  };

  const isSocketConnected = () => {
    if (!socketRef.current) {
      return false;
    }

    return true;
  };

  const reconnect = async (connectionId: string): Promise<boolean> => {
    const payload: WsPayload = { event: Events.RECONNECT, data: { connectionId: connectionId } };

    if (!socketRef.current) {
      await startSocket();
    }

    const res = await socketRef.current?.request(payload);

    // Store the new connectionId
    if (res?.success) {
      const newConnectionId = res.data?.connectionId;

      if (newConnectionId) {
        storage.setLocalStorage(CONNECTION_STORAGE_KEY, newConnectionId);
      }
    }

    return res?.success ?? false;
  };

  const createPlayer = async (name: string): Promise<boolean> => {
    if (!name) return false;

    if (!socketRef.current) {
      await startSocket();
    }

    const payload: WsPayload = { event: Events.CREATE_PLAYER, data: { name: name } };
    const res = await socketRef?.current?.request(payload);

    const connectionId = res?.data?.connectionId ?? "";

    storage.setLocalStorage(CONNECTION_STORAGE_KEY, connectionId);

    return res?.success ?? false;
  };

  const getRooms = async (): Promise<Array<RoomData>> => {
    const payload: WsPayload = { event: Events.GET_ROOMS };

    if (!socketRef.current) {
      await startSocket();
    }

    const res = await socketRef!.current!.request(payload);

    const rooms = res?.data?.rooms ?? [];

    return rooms;
  };

  return <SocketContext.Provider value={{ isSocketConnected, reconnect, createPlayer, getRooms }}>{children}</SocketContext.Provider>;
};
