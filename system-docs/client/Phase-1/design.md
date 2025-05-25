# Design of Structa-Frontend

## Core Pages

| Page                       | Route                                    | Description                              |
| -------------------------- | ---------------------------------------- | ---------------------------------------- |
| Login / Register           | `/login`, `/signup`                      | Auth forms                               |
| Home (DMs)                 | `/` or `/dm/:id`                         | One-on-one chats                         |
| Servers Overview           | `/servers`                               | List of joined/available servers         |
| Server Page                | `/servers/:serverId`                     | Active server view with channels sidebar |
| Channel Page               | `/servers/:serverId/channels/:channelId` | Chat / Voice / Game view                 |
| User Profile               | `/me`                                    | View/edit your account                   |
| Game View                  | `/games/:sessionId`                      | Multiplayer game UI                      |
| Call View (optional modal) | Overlay or `/call/:id`                   | Voice/video call interface               |


We shall make the page layouts/designs in this order

---

## Login/Register Page

