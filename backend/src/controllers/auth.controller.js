import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { emailValidation, passwordLengthCheck } from '../utils/validators/auth.validation.js';
import { handleServerError, handleCustomError } from '../utils/error.js';
import { upsertStreamUser } from '../utils/stream.js';

import User from '../models/user.model.js';

export const register = async (req, res)=>{
  try{
    const { username, email, password} = req.body;

    if(!username || !email || !password){
      return handleCustomError(res, 400, "All Fields are mandatory");
    }

    if (!emailValidation(email)) {
      return handleCustomError(res, 400, "Invalid Email Format");
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return handleCustomError(res, 409, "The Email is already in use");
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return handleCustomError(res, 401, "Username already Taken");
    }

    if(passwordLengthCheck(password)){
      return handleCustomError(res, 402, "Password Too Short. (min 6 characters)");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const idx = Math.floor(Math.random()*100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: randomAvatar
    });

    try{
      await upsertStreamUser({
        id:newUser._id.toString(),
        name:newUser.username,
        image:newUser.avatar || ""
      });
      console.log(`Stream user created for: ${newUser.username}`);
    }catch(error){
      console.error("Something went wrong");
    }

    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET,{expiresIn: "7d"});

    res.cookie("jwt", token,{
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })

    res.status(201).json({
      success: true,
      streamCheck: `Stream User Creation Successful (ID): ${newUser._id}`,
      message: "User Regiatration Successful",
      newUser
    });
  }catch(error){
    return handleServerError(res, error);
  }
}

export const login = async (req, res)=>{
  try{
    const { email, password } = req.body;

    if(!email || !password){
      return handleCustomError(res, 400, "All Fields are mandatory");
    }

    const user = await User.findOne({ email });
    if(!user){
      return handleCustomError(res, 404, "User Not Found");
    }

    const isPasswordValid = await user.matchPassword(password);
    if(!isPasswordValid){
      return handleCustomError(res, 409, "Incorrect Password");
    }

    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET, {expiresIn: "7d"});

    res.cookie("jwt", token,{
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(201).json({
      success: true,
      message: "User Login Successful",
      user
    })
  }catch(error){
    return handleServerError(res, error);
  }
}

export const logout = async (req, res)=>{
  try{
    res.clearCookie("jwt");
    res.status(201).json({
      success: true,
      message: "Logout Successful"
    });
  }catch(error){
    return handleServerError(res, error);
  }
}

export const onboard = (req, res)=>{
  try{
    console.log("Onboard Controller function");
  }catch(error){
    return handleServerError(res, error);
  }
}