import { useContext } from "react";
import { SocketContext } from "../contexts/socket/SocketContext";

export function useSocket() {
  const values = useContext(SocketContext);

  return values;
}
