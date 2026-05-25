# Broadcast

Some events will require a broadcast to some others connections in order to inform a change.

The broadcast will include information relevant to the new state of the modified event.

## Broadcast Format

All the broadcast will include the following structure:

```
{
    event: Event,
    sucess: Boolean,
    data?: any
}
```

### Specific Broadcast format

The "data" attribute in broadcast response vary depending the Event:

#### Room Broadcast Data

- JOIN_ROOM Event broadcast:

```
{
    newPlayerId: String
    playersSession: Number
}
```

- LEAVE_ROOM Event broadcast:

```
{
    removedPlayerId: String
    hostPlayerId?: String
    playersSession: Number
    newDrawerPlayerId?: String
}
```

#### Game Broadcast Data

- START_GAME Event broadcast:

```
{
    gameId: String
    drawTime: Number
    totalRounds: Number
    players: {id: String, name: String}[]
}
```

- START_ROUND and START_DRAW Event broadcast (redundant payload for ensuring correct data display):

```
{
    currentRound: number
    drawTime: Number
    currentDrawer: {id: String, name: String}
}
```

- NOTIFY_DRAWER Event broadcast:

```
{
    optionWords: String[]
    selectTime: Number
    timestamp: Number
    token: String
}
```

- START_DRAW Event broadcast:

```
{
    drawTime: Number
    wordLength: Number
}
```

- DRAW Event broadcast:

```
{
    point: {x: Number, y: Number, color: String, width: Number}
}
```

- Correct GUESS_WORD Event broadcast:

```
{
    player: {id: string, name: string},
    score: number
}
```

- Incorrect GUESS_WORD Event broadcast:

```
{
    player: {id: string, name: string},
    word: string
}
```

- SELECT_TIMEOUT Event does not have custom "data" attribute
