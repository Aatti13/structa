import { Router } from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

import { 
  getRecommendedUsers, 
  getFriends, 
  sendFriendReq, 
  acceptFriendReq 
} from "../controllers/user.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getFriends);

router.post("/friend-req/:id", sendFriendReq); 
router.put("/friend-req/:id/accept", acceptFriendReq); 

export default router;