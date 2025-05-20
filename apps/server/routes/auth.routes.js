import { register, loginUser, logout } from "../controllers/auth.controlle.js";
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
router.post("/logout", logout);

// API Endpoint: GET /api/auth
