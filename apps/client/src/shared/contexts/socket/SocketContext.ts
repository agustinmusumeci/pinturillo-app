import type { RoomData } from "@pinturillo/shared/src/room";
import { createContext } from "react";

interface SocketContextType {
  isSocketConnected: () => boolean;
  reconnect: (connectionId: string) => Promise<boolean>;
  createPlayer: (name: string) => Promise<boolean>;
  getRooms: () => Promise<Array<RoomData>>;
}

export const SocketContext = createContext({} as SocketContextType);
