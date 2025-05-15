// Library imports 
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { generateToken } from '../config/jwt.js';

// Component Imports
import User from '../models/User.js';
import connectDB from '../config/db.js';

/* 

Error Codes:
  - 403: User Already Exists
  - 500: Internal Server Error
  - 200: User Registered Successfully
  - 400: Bad Request
  
*/


// Register User
/* 
Schema components used: 
  - name
  - userId
  - email
  - password
  - provider
  - providerId
  - avatarURL
   
Objective:
  - Register a new user
  - Check if the user already exists
  - Hash the password
  - Save the user to the database
  - Return a success message
  - Return an error message if the user already exists or if there is an error
  - Return a success message if the user is registered successfully
  - Return an error message if there is an error
  - Return a token if the user is registered successfully
*/

export const registerUser = async (req, res)=>{
  try{
    const { name, userId, email, password, provider, providerId } = req.body;

    const registerAttempt = User.findOne({email});

    if(registerAttempt) return res.status(403).json({message: 'User Already Exists'});

    const hashedPassword = await bcrypt.hash(password, 10);
    
    if(!hashedPassword) return res.status(500).json({message: 'Error Hashing Password'});

    const newUser = new User({
      name,
      userId,
      email,
      password: hashedPassword,
      provider,
      providerId
    });

    await newUser.save();

    const token = generateToken({id: newUser._id, email: newUser.email}, '7d');

    res.status(200).json({
      message: 'User Registered Successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        provider: newUser.provider,
        providerId: newUser.providerId
      },
      token
    });
  }catch(err){
    res.status(500).json({message: err.message});
  }
}

// Login User
/* 

Schema components used:
  - email
  - password

Objective:
  - Login a user
  - Check if the user exists
  - Check if the password is correct
  - Return a success message
  - Return an error message if the user does not exist or if the password is incorrect
  - Return a token if the user is logged in successfully
  - Return a success message if the user is logged in successfully

*/
export const loginUser = async (req, res)=>{
  try{
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(!user || !await user.comparePassword(password)) return res.status(403).json({message: 'Invalid Credentials'});


    const token = generateToken({id: user._id}, '7d');
    res.status(200).json({
      message: 'User Logged In Successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });
  }catch(err){
    res.status(500).json({message: err.message});
  }
}


export const forgotPassword = async (req, res)=>{
  try{
    const { email } = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(403).json({message: 'User Not Found'});
  }catch(error){
    res.status(500).json({message: error.message});
  }
}

// export const resetPassword = async (req, res)=>{
//   try{

//   }catch(error){
//     res.status(500).json({message: error.message});
//   }
// }