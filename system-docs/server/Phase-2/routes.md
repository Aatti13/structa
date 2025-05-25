# Planned Routes

## Auth

| **Category** | **Method**                   | **Route**                      | **Description** |
| ------------ | ---------------------------- | ------------------------------ | --------------- |
|**Auth**  |                              |                                |                 |
| `POST`       | `/api/auth/register`         | Register a new user            |                 |
| `POST`       | `/api/auth/login`            | Login and return JWT           |                 |
| `POST`       | `/api/auth/logout`           | Logout and invalidate session  |                 |
| `GET`        | `/api/auth/me`               | Get current user info          |                 |
| `POST`       | `/api/auth/verify-email`     | Verify email with token        |                 |
| `POST`       | `/api/auth/forgot-password`  | Request password reset         |                 |
| `POST`       | `/api/auth/reset-password`   | Reset password                 |                 |
| `POST`       | `/api/auth/2fa/setup`        | Generate 2FA secret & QR       |                 |
| `POST`       | `/api/auth/2fa/verify`       | Verify TOTP code               |                 |
| `POST`       | `/api/auth/2fa/disable`      | Disable 2FA                    |                 |
| `GET`        | `/api/auth/2fa/backup-codes` | Get or regenerate backup codes |                 |

<hr>

## Users

| **Category** | **Method**       | **Route**                | **Description** |
| ------------ | ---------------- | ------------------------ | --------------- |
|  **Users** |                  |                          |                 |
|         | `GET` | `/api/users/:id` | Get public profile by ID               |
|         | `PUT` | `/api/users/:id`      | Update user profile                |
|         | `DELETE`     | `/api/users/:id` | Delete account           |                 


## Games

```
| 🎮 Games |
| POST | /api/games/start | Start new game session |
| POST | /api/games/:id/move | Send a game move |
| GET | /api/games/:id | Get game state |
| POST | /api/games/:id/join | Join a multiplayer game |
| POST | /api/games/:id/leave | Leave game session |
```