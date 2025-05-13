import expres from "express";
import dotenv from 'dotenv';

import connectDB from "./config/db";

dotenv.config();

const app = expres();
const PORT = 3300 || process.env.PORT;

connectDB();

app.listen(PORT, ()=>{
  console.log(`PORT: ${PORT}`)
});
