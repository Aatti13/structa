import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next)=>{
  try{
    const token = req.cookies.jwt;
    if(!token){
      return res.status(401).json("No Token Provided");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if(!decode){
      return res.status(403).json({
        success: false,
        message: "Unauthorized -- Invalid Token"
      });
    }

    const user = await User.findById(decode.userId).select("-password");
    
    if(!user){
      return res.status(403).json({
        success: false,
        message: "Unauthorized -- User does not exist"
      });
    }

    req.user = user;

    next();
  }catch(error){
    res.status(501).json({
      success: false,
      message: "Internal Error",
      error: error.message
    });
  }
}