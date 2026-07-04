import { useRef, type ReactNode } from "react";
import { SocketContext } from "./SocketContext";
import { Socket } from "../../socket/Socket";
import { SOCKET_URL } from "../../constants/url";
import { Events, type WsPayload } from "@pinturillo/shared/src/events";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const createPlayer = (name: string): boolean => {
    if (!name) return false;

    if (!socketRef.current) {
      socketRef.current = new Socket(SOCKET_URL, (payload) => {
        console.info("Socket connected received:", payload);
      });
    }

    const payload: WsPayload = { event: Events.CREATE_PLAYER, data: { name } };
    socketRef.current.send(payload);

    return true;
  };

  const isSocketConnected = () => {
    if (!socketRef.current) {
      return false;
    }

    return true;
  };

  return <SocketContext.Provider value={{ createPlayer, isSocketConnected }}>{children}</SocketContext.Provider>;
};
