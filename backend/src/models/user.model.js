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

const User = mongoose.model("User", userSchema);

userSchema.pre("save", async (next)=>{
  if(!this.isModified("password")) return next();

  try{
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
      
    next();
  }catch(error){
      next(error);
  }
});

export default User;