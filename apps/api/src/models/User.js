import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  avatarURL: {
    type: String,
    unique: true
  },
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
  googleID: String,
  facebookID: String,
  refreshToken: String,
},{timestamps: true});

export default mongoose.model('User', userSchema);