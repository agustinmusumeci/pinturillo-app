import { WsPayload } from "@pinturillo/shared/src/events";
import { Connection } from "../network/Connection";
import type { WebSocket as WsWebSocket } from "ws";

export interface WsContext {
  connection: Connection;
  ws: WsWebSocket;
  payload: WsPayload;
}

export type MiddlewareFn = (data: WsContext & Record<string, any>, next: (...args: any) => void) => void;
