export interface WsContext {
  connectionId: string;
  ws: WebSocket;
  payload: Record<string, any>;
}
