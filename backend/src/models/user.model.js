import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  bio: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: ""
  },
  nativeLanguage: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  }
},{timestamps: true});

userSchema.methods.matchPassword = async function (enteredPassword){
  const passwordValidation = await bcrypt.compare(enteredPassword, this.password);
  return passwordValidation;
}

const User = mongoose.model("User", userSchema);


export default User;