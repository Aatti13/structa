import mongoose from 'mongoose';
import { create } from 'qrcode';

const ResetTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 15 * 60 * 1000 // 15 minutes
  }
});

ResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('ResetToken', ResetTokenSchema);