import { handleServerError } from "../utils/error.js"
import { generateStreamToken } from "../utils/stream.js"

export const getStreamToken = async(req, res)=>{
  try{
    const token = generateStreamToken(req.user.id);
    res.status(200).json({token});
  }catch(error){
    return handleServerError(res, error);
  }
}