import { createContext } from "react";

interface SocketContextType {
  createPlayer: (name: string) => Promise<boolean>;
  isSocketConnected: () => boolean;
}

export const SocketContext = createContext({} as SocketContextType);
