import { createContext } from "react";

interface SocketContextType {
  createPlayer: (name: string) => boolean;
}

export const SocketContext = createContext({} as SocketContextType);
