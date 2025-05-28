import { Router } from "express"; 

import { register, login, logout, onboard } from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post("/onboarding", protectRoute, onboard);

export default router;