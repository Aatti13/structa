import { 
  register, 
  loginUser,
  logoutUser, 
  forgotPassword, 
  resetPassword
} from "../controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

// API Endpoint: POST /api/auth/
/* 
  1. Register a new User
  2. Login a User
  3. Logout a User
*/
router.post("/register", register);
router.post("/login", loginUser);


router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token",resetPassword);

export default router;

// API Endpoint: GET /api/auth
