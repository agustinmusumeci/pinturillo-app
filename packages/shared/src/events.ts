export enum Events {
  CREATE_PLAYER = "CREATE_PLAYER",
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  START_GAME = "START_GAME"
}

export interface WsEvent {
  event: Events;
  payload: any;
}
