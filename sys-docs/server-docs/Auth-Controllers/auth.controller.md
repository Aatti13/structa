# Autherntication Controller Functions

## Controllers:

```
  ├── controllers/
  │   ├── **auth.controller.js**
  │   ├── chat.controller.js
  │   ├── call.controller.js
  │   ├── game.controller.js
  │   └── user.controller.js
```
## Methods:

| **Function**               | **Description**                          | **HTTP Method & Endpoint**                         |
|---------------------------|------------------------------------------|----------------------------------------------------|
| `register`                | User Registration                        | `POST /api/auth/register`                          |
| `loginUser`               | User Login                               | `POST /api/auth/login`                             |
| `logoutUser`              | User Logout                              | `POST /api/auth/logout`                            |
| `forgotPassword`          | Forgot Password                          | `POST /api/auth/forgot-password`                   |
| `resetPassword`           | Reset Password                           | `POST /api/auth/reset-password`                    |
| `verifyEmail`             | Email Verification                       | `GET /api/auth/verify-email/:token`                |
| `resendVerification`      | Resend Verification Email                | `POST /api/auth/resend-verification`               |
| `getProfile`              | Get User Profile                         | *(method/route not specified)*                     |
| `updateProfile`           | Update User Profile                      | *(method/route not specified)*                     |
| `deleteAccount`           | Delete User Account                      | *(method/route not specified)*                     |
| `uploadAvatar`            | Upload Avatar (empty implementation)     | *(method/route not specified)*                     |
| `setupTwoFactorAuth`      | Setup Two-Factor Authentication          | *(method/route not specified)*                     |
| `verifyTwoFactorAuth`     | Verify Two-Factor Authentication         | *(method/route not specified)*                     |
| `disableTwoFactorAuth`    | Disable Two-Factor Authentication        | *(method/route not specified)*                     |
| `getActiveSessions`       | Get Active Sessions for User             | *(method/route not specified)*                     |
| `terminateSession`        | Terminate a Specific Session             | *(method/route not specified)*                     |

## Error Codes

| **Status Code** | **Meaning**                                             |
|-----------------|----------------------------------------------------------|
| `200 OK`        | Request succeeded. Response body contains the result.    |
| `201 Created`   | Resource was successfully created (e.g., user registered).|
| `400 Bad Request` | Request is malformed or missing required fields.       |
| `401 Unauthorized` | Authentication is missing or invalid.                 |
| `403 Forbidden` | Authenticated, but not allowed to perform the action.   |
| `404 Not Found` | The requested resource does not exist.                  |
| `409 Conflict`  | A resource conflict occurred (e.g., email already exists).|
| `410 Gone`      | The resource (e.g., token) is no longer valid.          |
| `415 Unsupported Media Type` | Uploaded file type is not supported.       |
| `429 Too Many Requests` | Rate limit exceeded.                           |
| `500 Internal Server Error` | Unexpected error on the server side.         |

## Testing Inputs for Methods

### 1. User Registration

``` json

{
  "username": "<USERNAME>",
  "email": "<EMAIL>: bala.boy@gmail.com",
  "password": "<PASSWORD>",
}
```

### 2. User Login

``` json

{
  "email": "<EMAIL>",
  "password": "<PASSWORD>",
}
```

---

## Conditions for Test Cases:

- User Registration
  1. Check if existing user (by Email)
  2. Check if existing username

- User Login
  1. Check for valid email
  2. Check if user is verified
  3. Check if password is valid
  4. Check if 2FA is enabled
  5. Check for active sessions and sign JWT token

- LogOut User
  1. Check Token

- Forgot Password
  1. Check if user exists (by Email)

- Reset Password
  1. Search by Reset Token
  2. Check if User Exists
  3. Check if Reset token still valid
  4. Check if Token has expired or not

