import {StreamChat} from "stream-chat";
import "dotenv/config"
import User from "../models/user.model.js";


const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_SECRET = process.env.STREAM_SECRET

if(!STREAM_API_KEY || ! STREAM_SECRET){
  console.error("Undefined API Key/Secret");
}

const streamClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_SECRET);

export const upsertStreamUser = async (userData)=>{
  try{
    await streamClient.upsertUsers([userData]);
    return userData;
  }catch(error){
    console.error(`Something went wrong..: ${error}`);
  }
}

export const generateStreamToken = (userId)=>{
  
}

/**
 * Prev Error: Something went wrong..: Both secret and user tokens are not set. Either client.connectUser wasn't called or client.disconnect was called
 */
