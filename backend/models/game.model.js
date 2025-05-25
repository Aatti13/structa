 import mongoose from "mongoose";

 const gameSchema = new mongoose.Schema({
  gameType: { type: String, required: true, enum: ["chess", "checkers", "go"] },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  state: { type: String, enum: ["waiting", "in_progress", "finished"], default: "waiting" },
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: "Server", required: true },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
 });

 export default mongoose.model("Game", gameSchema);