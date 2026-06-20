import type { ReactNode } from "react";
import { SocketContext } from "./SocketContext";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const createPlayer = (name: string) => {
    // Create the socket and store the connection
    console.log(name);
  };

  return <SocketContext.Provider value={{ createPlayer }}>{children}</SocketContext.Provider>;
};
