 import mongoose from 'mongoose';

 const channelSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['text', 'voice', 'video'], default: 'text' },
  messages: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }], // Exclusively for Text Channel
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Exclusively for Voice/Video Channel
  createdAt: { type: Date, default: Date.now },
 });

 export default mongoose.model('Channel', channelSchema);