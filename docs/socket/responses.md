# Responses to events

The events will responde with an ACK to the user connection that sends the event.

The ACK will include the name of the event and the success status as a boolean value.

```
{
    event: Event,
    correlationId: String,
    sucess: Boolean,
    data?: Any,
}
```

## Response data format

The data of an event response will vary according to the event itself.

- JOIN_ROOM Data Event Response:

```
{
    players?: {id: String, name: String, score: Number, hasGuessed?: Boolean}
    message: String
}
```

- LEAVE_ROOM Data Event Response:

```
{
    message: String
}
```

- GUESS_WORD Data Event Response:

```
{
    score: Number
    message: String
}
```
