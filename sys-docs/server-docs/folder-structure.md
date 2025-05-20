# Server Folder Structure

```
api/                          # Node.js backend (Express + CouchDB)
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   ├── call.controller.js
│   │   ├── game.controller.js
│   │   └── user.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── chat.routes.js
│   │   ├── call.routes.js
│   │   ├── game.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── chat.service.js
│   │   ├── webrtc.service.js
│   │   └── game.service.js
│   │
│   ├── socket/
│   │   ├── index.js
│   │   ├── chat.socket.js
│   │   ├── call.socket.js
│   │   └── game.socket.js
│   │
│   └── models/               # CouchDB schema definitions
│       ├── User.js
│       └── Session.js
│
└── index.js                  # Main server entry point
```