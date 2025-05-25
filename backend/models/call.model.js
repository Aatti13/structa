 import mongoose from "mongoose";

 const callSchema = new mongoose.Schema({
    type: { type: String, enum: ['voice', 'video'], required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    isEnded: { type: Boolean, default: false },
    endedAt: { type: Date },
    isGroupCall: { type: Boolean, default: false },
    callDuration: { type: Number, default: 0 }, // Duration in seconds
 });

 export default mongoose.model("Call", callSchema);