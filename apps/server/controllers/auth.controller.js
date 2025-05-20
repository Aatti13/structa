import { v4 } from "uuid";
import { getDB } from "../db.js";
import User from "../models/User.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";

const db = getDB();

// register() ==> User Registration
/*
  Schema Parameters Used:
  - username
  - email
  - password
  - verificationToken
  - verificationTokenExpiry

  API Endpoint: POST /api/auth/register
*/
export const register = async (req, res)=>{
  try{
    // API Endpoint Format
    const {username, email, password} = req.body;


    // Method to check if the user already exists (Based on Email)
    const existingUser = await User.findByEmail(email);
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "Email already in use...",
      });
    }

    // Method to check if the user already exists (Based on Username)
    const existingUsername = await User.findByUsername(username);
    if(existingUsername){
      return res.status(400).json({
        success: false,
        message: "Username already in use...",
      });
    }

    // Password Hashing
    // BlowFish Cipher Algorithm
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hassh(password, salt);

    // Randomly Generate Verification Token
    /* 
      Verification Token Duration: 5 minutes 
    */
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Creating new User Profile upon Registration
    /*
      User Profile Schema:
      - _id
      - type
      - username
      - email
      - password
      - verificationToken
      - verificationTokenExpiry
      - isVerified
      - createdAt
      - updatedAt
      - avatar
      - status
      - servers
      - directMessages
      - friends
      - friendRequests
      - blockedUsers
    */
    const newUser = {
      _id: v4(),
      type: "user",
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      avatar: null,
      status: 'Offline',
      servers: [],
      directMessages: [],
      friends: [],
      friendRequests: [],
      blockedUsers: [],
      bio: '',
    }

    // To Create New User Profile
    await newUser.create(newUser);

    // Email Verification
    /*
      Email Verification Link Format:
      - http://localhost:3000/verify-email?token=verificationToken
    */
    const emailVerificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    // Alternate: const verificationUrl = `${config.clientUrl}/verify-email/${verificationToken}`;

    await emailService.sendVerificationEmail(email, emailVerificationLink);

    // Success Response
    /*
      Response Format:
      - STATUS: success
      - message
      - userId
    */
    res.status(201).json({
      success: true,
      message: "User Registration Successful",
      userId: newUser._id
    })

  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while registering user",
    });
  }
}


// loginUser() ==> User Login
/*
  Schema Parameters Used:
  - email
  - password

  API Endpoint: POST /api/auth/login
*/
export const loginUser = async (req, res)=>{
  try{
    const {email, password} = req.body;

    const loggingUser = await User.findByEmail(email);
    if(!loggingUser){
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if(!loggingUser.isVerified){
      return res.status(403).json({
        success: false,
        message: "Please verify your email address before proceeding...",
      })
    }

    // Password Verification
    // Comparing Input and Stored Password
    const isPasswordVaid = await bcrypt.compare(password, loggingUser.password);
    
    // If Password not Valid
    // Send Error Response
    if(!isPasswordVaid){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Check if 2FA is enables
    if(loggingUser.isTwoFAEnabled){
      // Generate 2FA Code
      const twoFACode = crypto.randomBytes(3).toString("hex");
      // Send 2FA Code to User via Email
      await emailService.sendTwoFACode(loggingUser.email, twoFACode);
      // Save 2FA Code to DB
      await User.updateProfile(loggingUser._id, {twoFACode});
      return res.status(200).json({
        success: true,
        message: "2FA Code sent to your email address",
        userId: loggingUser._id,
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {userId: loggingUser._id, email: loggingUser.email},
      config.JWT_SECRET, 
      { expiresIn: "7d",}
    );

    // Creating a New Session
    /*
      Session Schema:
      - _id
      - userId
      - token
      - userAgent
      - ipAddress
      - createdAt
      - expiresAt
    */
    const session = {
      _id: v4(),
      userId: loggingUser._id,
      token,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      createdAt: new Date().toString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 hour
    };

    // Create new Active Session
    await sessionService.createSession(session);

    // Update User Profile
    /**
     Updating:
      - lastLogin
      - status
      - Notifications
     */
    await User.updateProfile(
      loggingUser._id,
      'onine', 
      {lastLogin: new Date().toString(),}
    );

    // Success Response
    /*
      Response Format:
      - STATUS: success
      - message
      - token
      - user
        - id
        - username
        - email
        - avatar
        - status
        - createdAt
    */
    res.status(200).json({
      success: true,
      message: "User Login Successful",
      token,
      user: {
        id: loggingUser._id,
        username: loggingUser.username,
        email: loggingUser.email,
        avatar: loggingUser.avatar,
        status: 'online',
        createdAt: loggingUser.createdAt,
      }
    })

  }catch(error){
    // Error Response
    /*
      Response Format:
      - STATUS: error
      - message
    */
    res.status(500).json({
      success: false,
      message: "Error while logging in user",
    });
  }
}

// logoutUser() ==> User Logout
/*
  API Endpoint: POST /api/auth/logout
*/
export const logoutUser = async (req, res)=>{
  try{
    const token = req.headers["authorization"].split(" ")[1];

    // Deleting an Active Session
    /*
      Session Schema:
      - _id
      - userId
      - token
      - userAgent
      - ipAddress
      - createdAt
      - expiresAt
    */
    await sessionService.deleteSession(token);

    // Update User Profile
    /**
     Updating:
      - lastLogin
      - status
      - Notifications
     */
    await User.updateProfile(
      req.user._id,
      'offline', 
      {status: 'offline',}
    );

    // Success Response
    /*
      Response Format:
      - STATUS: success
      - message
    */
    res.status(200).json({
      success: true,
      message: "User Logout Successful",
    });

  }catch(error){
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error while logging out user",
    });
  }
}

// forgotPassword() ==> User Forgot Password
/*
  Schema Parameters Used:
  - email
  - resetToken
  - resetTokenExpiry

  API Endpoint: POST /api/auth/forgot-password
*/
export const forgotPassword = async (req, res)=>{
  try{
    const {email} = req.body;

    // Check if the user exists
    const user = await User.findByEmail(email);
    // If user not found
    // Send Error Response
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Update the user's profile with the reset token and expiry
    await User.updateProfile(user._id, {
      resetToken,
      resetTokenExpiry,
    });

    // Send the password reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email address",
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while sending password reset link",
    });
  }
}

// resetPassword() ==> User Reset Password
/*
  Schema Parameters Used:
  - token
  - password

  API Endpoint: POST /api/auth/reset-password
*/
export const resetPassword = async (req, res)=>{
  try{
    // API Endpoint Format
    const {token, password} = req.body;

    // Check if the token is valid
    const user = await User.findByResetToken(token);

    // Find the user by the reset token
    if(!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()){
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Bcrypt Password Hashing
    // BlowFish Cipher Algorithm
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the reset token
    await User.updateProfile(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    // Send success response
    /*
      Response Format:
      - STATUS: success
      - message
    */
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    })

  }catch(error){
    // Error Response
    /*
      Response Format:
      - STATUS: error
      - message
    */
    res.status(500).json({
      success: false,
      message: "Error while resetting password",
    });
  }
}

// verifyEmail() ==> User Email Verification
/*
  Schema Parameters Used:
  - token

  API Endpoint: GET /api/auth/verify-email/:token
*/
export const verifyEmail = async (req, res)=>{
  try{
    const {token} = req.params;

    // Find the user by the verification token
    const user = await User.findByVerificationToken(token);
    // If user not found
    // Send Error Response
    // Check if the token is valid
    if(!user || !user.verificationTokenExpiry || user.verificationTokenExpiry < Date.now()){
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Update the user's profile to mark them as verified
    await User.updateProfile(user._id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    });

    // Send success response
    /*
      Response Format:
      - STATUS: success
      - message
    */
    //  res.redirect(`${process.env.CLIENT_URL}/email-verified`);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  }catch(error){
    // Error Response
    /*
      Response Format:
      - STATUS: error
      - message
    */
    res.status(500).json({
      success: false,
      message: "Error while verifying email",
    });
  }
}

// resetVerification() ==> Resend Verification Email
/*
  Schema Parameters Used:
  - email

  API Endpoint: POST /api/auth/resend-verification
*/
export const resendVerification = async (req, res)=>{
  try{
    const {email} = req.body;

    
    // Check if the user exists
    const user = await User.findByEmail(email);
    // If user not found
    // Send Error Response
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Update the user's profile with the new verification token and expiry
    await User.updateProfile(user._id, {
      verificationToken,
      verificationTokenExpiry,
    });

    // Send the verification email
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await emailService.sendVerificationEmail(email, verificationLink);

    res.status(200).json({
      success: true,
      message: "Verification email resent successfully",
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while resending verification email",
    });
  }
}

// 
export const getProfile = async (req, res)=>{
  try{
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        createdAt: user.createdAt,
        twoFactorEnabled: !!user.twoFactorEnabled
      }
    })
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while fetching user profile",
    });
  }
}

export const updateProfile = async (req, res)=>{
  try{
    const userId = req.user.userId;
    const {username, email, currentPassword, avatar, bio} = req.body;

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordVaid = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordVaid){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if(username && username !== user.username){
      const existingUsername = await User.findByUsername(username);
      if(existingUsername){
        return res.status(400).json({
          success: false,
          message: "Username already in use...",
        });
      }
    }

    if(email && email !== user.email){
      const existingEmail = await User.findByEmail(email);
      if(existingEmail){
        return res.status(400).json({
          success: false,
          message: "Email already in use...",
        });
      }
    }

    const updatedFields = {};

    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (avatar) updatedFields.avatar = avatar;
    if(bio) updatedFields.bio = bio;

    if (Object.keys(updatedFields).length > 0) {
      await User.updateProfile(userId, updatedFields);
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        ...user,
        ...updatedFields
      }
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while updating user profile",
    });
  }
}

export const deleteAccount = async (req, res)=>{
  try{
    const userId = req.user.userId;
    const {password} = req.body;

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordVaid = await bcrypt.compare(password, user.password);
    if(!isPasswordVaid){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Delete the user account
    await Session.deleteAllSessions(userId);

    await User.deleteAccount(userId);

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while deleting user account",
    });
  }
}

export const uploadAvatar = async (req, res)=>{
  try{

  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while uploading avatar",
    });
  }
}

export const setupTwoFactorAuth = async (req, res)=>{
  try{
    const userId = req.user.userId;

    const secret = speakeasy.generateSecret({length: 20});
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    await User.storeTempTwoFactorSecret(userId, secret.base32);
    
    res.status(200).json({
      success: true,
      message: 'Two-factor authentication setup initiated',
      secret: secret.base32,
      qrCode
    });

  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while setting up 2FA",
    });
  }
}

export const verifyTwoFactorAuth = async (req, res)=>{
  try{
    const userId = req.user.userId;
    const {token} = req.body;

    const user = await User.findById(userId);
    if(!user || !user.tempTwoFactorSecret){
      return res.status(404).json({
        success: false,
        message: "User not found or 2FA not setup",
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.tempTwoFactorSecret,
      encoding: 'base32',
      token,
    });

    if(!verified){
      return res.status(400).json({
        success: false,
        message: "Invalid 2FA token",
      });
    }

    await User.enableTwoFactor(userId, user.tempTwoFactorSecret);

    res.status(200).json({
      success: true,
      message: "Two-factor authentication enabled successfully",
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while verifying 2FA",
    });
  }
}

export const disableTwoFactorAuth = async (req, res)=>{
  try{
    const userId = req.user.userId;
    const {password} = req.body;

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordVaid = await bcrypt.compare(password, user.password);
    if(!isPasswordVaid){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    await User.disableTwoFactor(userId);

    res.status(200).json({
      success: true,
      message: "Two-factor authentication disabled successfully",
    })
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while disabling 2FA",
    });
  }
}


export const getActiveSessions = async (req, res)=>{
  try{
    const userId = req.user.userId;

    const sessions = await Session.findByUserId(userId);

    const formattedSessions = sessions.map(session => ({
      id: session._id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      current: session.token === req.headers["authorization"].split(" ")[1]
    }));

    res.status(200).json({
      success: true,
      message: "Active sessions fetched successfully",
      sessions: formattedSessions,
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while fetching active sessions",
    });
  }
}


export const terminateSession = async (req, res)=>{
  try{
    const userId = req.user.userId;
    const {sessionId} = req.body;

    const session = await Session.findById(sessionId);
    if(!session){
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const currentToken = req.headers["authorization"].split(" ")[1];
    if(session.token === currentToken){
      return res.status(400).json({
        success: false,
        message: "Cannot terminate current session",
      });
    }

    await Session.delete(sessionId);

    res.status(200).json({
      success: true,
      message: "Session terminated successfully",
    })
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error while terminating session",
    });
  }
}