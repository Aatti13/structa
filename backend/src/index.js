// Pre-set Libraries
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Route Imports
import authRoutes from './routes/auth.routes.js';

// Util Imports
import { connectDB } from './utils/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, ()=>{
  console.log(`Server running at: http://localhost:${PORT}`);
  connectDB();
})