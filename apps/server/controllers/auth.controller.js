import bcrypt from 'bcrypt';
import User from '../models/User.js';


export const register = async (req, res) => {
  try{
    const {username, email, password, avatarURL} = req.body;
    const existingUser = await User.findByEmail(email);
    if(existingUser){
      return res.status(400).json({error: 'Email already exists'});
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      passwordHash,
      avatarURL,
    });
    const token =  4;

    res.status(201).json({token, user});

  }catch(error){
    res.status(500).json({error: 'Failed to Register'});
  }
}

export const loginUser = async (req, res)=>{
  try{
    const {email, password} = req.body;
    const user = await User.findByEmail(email);

    if(!user || !(await bcrypt.compare(password, user.passwordHash))){
      return res.status(400).json({error: 'Invalid email or password'});
    }

    const token = 4;
    res.status(200).json({token, user});
  }catch(error){
    res.status(500).json({error: 'Failed to Login'});
  }
}

export const oAuthGoogle = async (req, res)=>{
  try{
    const {credential} = req.body;
    if(!credential) return res.status(400).json({error: 'Credentials not Found'});

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.username;
    const avatarURL = payload.picture;

    let user = await User.findByEmail(email);
    if(!user){
      user = await User.create({
        username,
        email,
        passwordHash: '',
        avatarURL,
      });
    }

    const token = 4;
    res.status(200).json({token, user});
  }catch(error){
    console.error('Error during Google OAuth:', error);
    res.status(500).json({error: 'Failed to Login with Google'});
  }
}