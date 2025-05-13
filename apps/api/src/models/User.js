import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  avatarURL: String,
  mfaEnabled: {
    type: Boolean,
    default: true
  },
  mfaSecret: String,
  provider: String,
  providerID: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: String,
},{timestamps: true});

export default mongoose.model('User', userSchema);