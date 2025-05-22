import mongoose from "mongoose";

const ServerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  members: [{
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    role: {
      type: String,
      enum: ['admin', 'mod', 'member'],
      default: 'member'
    }
  }],
  invites: [{
    type: String
  }]
}, {timestamps: true});

const Server = mongoose.model("Server", ServerSchema);
export default Server;