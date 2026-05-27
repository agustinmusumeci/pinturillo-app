# Responses to events

The events will responde with an ACK to the user connection that sends the event.

The ACK will include the name of the event and the success status as a boolean value.

```
{
    event: Event
    sucess: Boolean
    data?: Any
}
```

## Response payload format

The payload of an event will vary according to the event itself.
