# Sockets and REST API Setup

## Chat
| Event                | Direction       | Payload                  |
| -------------------- | --------------- | ------------------------ |
| `chat:message`       | client → server | `{ channelId, content }` |
| `chat:message:new`   | server → client | `{ message }`            |
| `chat:typing`        | client → server | `{ channelId }`          |
| `chat:typing:update` | server → client | `{ userId, channelId }`  |


## Calls

| Event               | Direction       | Payload         |
| ------------------- | --------------- | --------------- |
| `call:offer`        | client → server | WebRTC offer    |
| `call:answer`       | client → server | WebRTC answer   |
| `call:join`         | client → server | `{ callId }`    |
| `call:participants` | server → client | `{ users: [] }` |

## Games

| Event         | Direction       | Payload            |
| ------------- | --------------- | ------------------ |
| `game:move`   | client → server | `{ gameId, move }` |
| `game:update` | server → client | `{ gameState }`    |

## Presence

| Event          | Direction       | Payload      |
| -------------- | --------------- | ------------ |
| `user:online`  | server → client | `{ userId }` |
| `user:offline` | server → client | `{ userId }` |
