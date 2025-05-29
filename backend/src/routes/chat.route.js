import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

import { getStreamToken } from "../controllers/chat.controller.js";

const router = Router();

router.use(protectRoute);
router.get("/token", getStreamToken);

export default router;