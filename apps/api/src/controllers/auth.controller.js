import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User';

const registerUser = async (req, res)=>{
  try{
    const { name, email, password, provider, providerID} = req.body;

    const existingUser = await User.findOne({email});
    if(!existingUser){
      hashedPassword = null;
      if(password){
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        provider,
        providerID
      });

      await newUser.save();

      const token = jwt.sign(
        {id: newUser._id, email: newUser.email},
        JWT_SECRET, 
        {expiresIn: '7d'}
      );

      res.status(201).json({
        code: '201',
        message: "New User Registered Successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          provider: newUser.provider,
          providerID: newUser.providerID
        }
      })

    }
  }catch(error){
    await res.status(403).json({message: "Server Error"});
  }
}