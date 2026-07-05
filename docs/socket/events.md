# Available events to send

The available events that ConnectionsController can handle are defined in "/packages/shared/src/events.ts".

All other event that is not considered in there, will be ignored

## Send data format

Some events will require to send data to modify a current object and that data needs to be in a standar format.

All the data send will follow the following format:

```
{
    event: Event,
    correlationId?: String,
    data: Any
}
```
