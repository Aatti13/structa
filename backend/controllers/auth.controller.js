import crypto from 'crypto';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// registerUser() --> Register New User
/* 
  This Function handles user registration,
  Performs the following checks:
    1. Checks if all required fields are provided.
    2. Checks if a user already exists with the provided email.
    3. Checks if Username is already taken.

    The Main task of the controller function:
      - To Hash the password using bcrypt.
      - To Create a new user in the database with the provided details.
      - To Return a success response with user details if registration is successful.
      - To Return appropriate error messages if any validation fails.
      - To Handle any server errors that may occur during the process.
*/
export const registerUser = async (req, res)=>{
  try{
    const { username, email, password } = req.body;
    if(!username || !email || !password){
      return res.status(400).json({
        succcess: false,
        message: 'All fields are required'
      })
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Hashing the password
    // Using bcrypt to hash the password with a salt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // New User Object
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profile: {
        avatarUrl: '',
        bio: 'Loving Structa'
      }
    });

    await User.create(newUser);

    // Success Response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profile: newUser.profile
      }
    });
  }catch(error){
    res.status(500).json({
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
}

// loginUser() --> Login User
