// Pre-set Libraries
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from  "cors";

// Route Imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

// Util Imports
import { connectDB } from './utils/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors({
  origin: "http://localhost/3300",
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, ()=>{
  console.log(`Server running at: http://localhost:${PORT}`);
  connectDB();
})