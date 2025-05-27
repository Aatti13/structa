import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import User from '../models/user.model.js';

export const register = async (req, res)=>{
  try{
    const { username, email, password} = req.body;

    if(!username || !email || !password){
      return res.status(400).json({
        success: false,
        message: "All Fields are mandatory"
      });
    }
    const emailRegex = `/^[^\s@]+@[^\s@]+\.[^\s@]+$/$`;
    if(!emailRegex.test(email)){
      return res.status(400).json({
        success: false,
        message: "invalid Email Format"
      });
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(409).json({
        success: 'false',
        message: "The Email is Already in Use."
      });
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return res.status(401).json({
        success: false,
        message: "Username Already Taken"
      });
    }

    if(password.length < 6){
      return res.status(402).json({
        success: false,
        message: "Password Too Short. (min 6 characters)"
      });
    }

    const idx = Math.floor(Math.random()*100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = new User.create({
      username,
      email,
      password,
      avatar: randomAvatar
    });

    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET,{expiresIn: "7d"});

    res.cookie("jwt", token,{
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })


    res.status(201).json({
      success: true,
      message: "User Regiatration Successful"
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export const login = async (req, res)=>{
  try{
    res.status(201).json({
      success: true,
      message: "Login Successful",
      newUser
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

export const logout = async (req, res)=>{
  try{
    res.status(201).json({
      success: true,
      message: "Logout Successful"
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}