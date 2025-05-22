import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import dotenv from "dotenv";

import User from "../models/User.js";
import Session from "../models/Session.js";
import ResetToken from "../models/ResetToken.js";

dotenv.config();
/*
Functions:
  - register
  - loginUser
  - logoutUser
  - forgotPassword
  - resetPassword
  - verifyEmail
  - resendVerification
  - getProfile
  - updateProfile
  - deleteAccount
  - uploadAvatar
  - setupTwoFactorAuth
  - verifyTwoFactorAuth
  - disableTwoFactorAuth
  - getActiveSessions
  - terminateSession
*/

export const register = async (req, res)=>{
  try{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "User Already Exists"
      });
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return res.status(400).json({
        success: false,
        message: "Username Already in use"
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      passwordHash: hashedPassword,
    });

    await User.create(newUser);

    res.status(201).json({
      success: true,
      message: "User Registration Successful"
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

export const loginUser = async (req, res)=>{
  try{
    const {email, password, twoFactorCode} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User Not Found"
      });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if(!validPassword){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    if(user.twoFactorEnabled){
      if(!twoFactorCode){
        return res.status(400).json({
          success: false,
          message: "2FA Code is required"
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode
      });

      if(!verified){
        return res.status(400).json({
          success: false,
          message: "Invalid 2FA Code"
        });
      }
    }

    const sessionId = v4();
    await Session.create({
      user: user._id,
      sessionId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    const token = jwt.sign({userId: user._id, sessionId}, process.env.JWT_SECRET, {expiresIn: '3d'});

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      sessionId,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: 'online'
      }
    });

  }catch(error){
    res.status(500).json({
      success: false,
      message: "Login Failed",
      error: error.message
    });
  }
}

export const logoutUser = async (req, res) => {
  try {
    const sessionId = req.sessionId;

    if (!sessionId) {
      return res.status(400).json({ message: 'Missing session information.' });
    }

    // Remove session from DB
    const result = await Session.findOneAndDelete({ sessionId });

    if (!result) {
      return res.status(404).json({ message: 'Session not found or already terminated.' });
    }

    res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed. Please try again.' });
  }
};

export const forgotPassword = async (req, res)=>{
  try{
    const {email} = req.body;
    if(!email){
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    let resetToken = v4();
    resetToken = jwt.sign({userId: user._id, resetToken}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.status(200).json({
      success: true,
      message: "Reset Token Generated (Simuation)",
      resetToken
    });

  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error Occurred",
      error: error.message
    });
  }
}

export const resetPassword = async (req, res)=>{
  try{
    const { token } = req.params;
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetRecord = await ResetToken.findOne({ user: user._id, token });
    if (!resetRecord) return res.status(400).json({ error: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clean up used token
    await ResetToken.deleteOne({ _id: resetRecord._id });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error While Resetting Password",
      error: error.message
    });
  }
}