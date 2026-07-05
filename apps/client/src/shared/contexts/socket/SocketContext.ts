import { createContext } from "react";

interface SocketContextType {
  isSocketConnected: () => boolean;
  createPlayer: (name: string) => Promise<boolean>;
  getRooms: () => Promise<Array<unknown>>;
}

export const SocketContext = createContext({} as SocketContextType);
