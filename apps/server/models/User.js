import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  server: [{type: mongoose.Schema.Types.ObjectId, ref: 'Server'}],
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  status: {
    type:String,
    enum: ['online', 'offline', 'afk'],
    default: 'offline'
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);
export default User;