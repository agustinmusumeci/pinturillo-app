import type { Events } from "./events";

export interface WsACK {
  event: Events;
  success: boolean;
  data?: { message?: string; correlationId?: string; connectionId?: string; [key: string]: any };
}
