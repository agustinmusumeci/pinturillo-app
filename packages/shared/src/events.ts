export enum Events {
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
}

export interface WsEvent {
  event: Events;
  payload: any;
}
