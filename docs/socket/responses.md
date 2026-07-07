# Responses to events

The events will responde with an ACK to the user connection that sends the event.

The ACK will include the name of the event and the success status as a boolean value.

```
{
    event: Event,
    sucess: Boolean,
    correlationId?: String,
    data?: {...Any, message?: String, correlationId?: String},
}
```

## Response data format

The data of an event response will vary according to the event itself.

- GET_ROOMS Data Event Response:

```
{
    rooms: RoomData[],
    message: String,
    correlationId: String
}
```

- JOIN_ROOM Data Event Response:

```
{
    players?: PlayerData[],
    message: String,
    correlationId: String
}
```

- LEAVE_ROOM Data Event Response:

```
{
    message: String,
    correlationId: String
}
```

- GUESS_WORD Data Event Response:

```
{
    score: Number
    message: String
}
```
