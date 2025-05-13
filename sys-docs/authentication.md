# Authentication System

## Auth Routes

| Route                   | Method | Description              |
| ----------------------- | ------ | ------------------------ |
| `/auth/register`        | POST   | Register user            |
| `/auth/login`           | POST   | Login + JWT              |
| `/auth/verify-email`    | GET    | Email verification       |
| `/auth/forgot-password` | POST   | Send reset email         |
| `/auth/reset-password`  | POST   | Set new password         |
| `/auth/enable-mfa`      | POST   | Enable MFA (show QR)     |
| `/auth/verify-mfa`      | POST   | Submit OTP code          |
| `/auth/oauth/google`    | GET    | Google login redirect    |
| `/auth/oauth/facebook`  | GET    | Facebook login redirect  |
| `/auth/refresh`         | POST   | Refresh access token     |
| `/auth/logout`          | POST   | Invalidate refresh token |

