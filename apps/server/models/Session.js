import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 3 * 24 * 60 * 60 * 1000 // 3 days
  },
});


const Session = mongoose.model("Session", SessionSchema);
export default Session;