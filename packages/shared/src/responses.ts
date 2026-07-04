import type { Events } from "./events";

export interface WsACK {
  event: Events;
  success: boolean;
  message: string;
  correlationId?: string;
  data?: any;
}
