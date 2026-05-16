# Broadcast

Some events will require a broadcast to some others connections in order to inform a change.

The broadcast will include information relevant to the new state of the modified event.

LEAVE_ROOM Event broadcast:

```
{
    removedPlayerId: String
    hostPlayerId?: String
    playersSession: Number
}
```
