import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
  username: { type: String, required: true,unique: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },

  profile: {
    avatarUrl: {type: String, default: ""},
    bio: {type: String, default: "Loving Structa"}
  },

  is2FAEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String},
  twoFABackupCodes: [{type: String}],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);