import type { RoomData } from "@pinturillo/shared/src/room";
import type { WsACK } from "@pinturillo/shared/src/responses";
import { createContext } from "react";

interface SocketContextType {
  isSocketConnected: () => boolean;
  reconnect: (connectionId: string) => Promise<boolean>;
  createPlayer: (name: string) => Promise<boolean>;
  getRooms: () => Promise<Array<RoomData>>;
  joinRoom: (roomId: string, password?: string) => Promise<WsACK | null>;
}

export const SocketContext = createContext({} as SocketContextType);
