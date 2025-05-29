import mongoose from 'mongoose';

const friendReqSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending"
  }
}, {timestamps: true});

const FriendReq = await mongoose.model("FriendReq", friendReqSchema);

export default FriendReq;