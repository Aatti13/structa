# MongoDB Schemas

## User

``` js
{
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profile: {
    avatarUrl: { type: String },
    bio: { type: String, default: "" },
  },

  // --- 2FA Fields ---
  is2FAEnabled: { type: Boolean, default: false },
  twoFASecret: { type: String }, // base32 secret key (encrypted or hashed)
  twoFABackupCodes: [{ type: String }], // hashed backup codes

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Server

``` js
{
  name: String,
  owner: ObjectId, // User
  iconUrl: String,
  members: [ObjectId], // User IDs
  channels: [ObjectId],
  roles: [{
    name: String,
    permissions: [String] // e.g. ["MANAGE_CHANNELS", "BAN_USERS"]
  }],
  createdAt: Date
}
```

## Channel

``` js
{
  serverId: ObjectId,
  name: String,
  type: String, // "text" | "voice" | "video" | "game"
  messages: [ObjectId], // Only for text
  participants: [ObjectId] // Only for voice/video/game
}
```

## Call

``` js
{
  type: "voice" | "video",
  participants: [ObjectId],
  startedAt: Date,
  endedAt: Date,
  channelId: ObjectId,
  isGroup: Boolean
}
```

## GameSession

``` js
{
  gameType: String,
  players: [ObjectId],
  state: Object,
  serverId: ObjectId,
  channelId: ObjectId,
  isActive: Boolean,
  startedAt: Date
}
```

