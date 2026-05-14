export enum Events {
  "JOIN_ROOM",
  "LEAVE_ROOM",
}

export interface WsEvent {
  event: Events;
  payload: any;
}
