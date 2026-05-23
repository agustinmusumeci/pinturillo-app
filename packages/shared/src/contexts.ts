export interface WsContext {
  ws: WebSocket;
  payload: Record<string, any>;
  connectionId: string;
}
