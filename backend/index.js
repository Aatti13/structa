import express from 'express';
import dotenv from 'dotenv';

import connectDB from './utils/db.js';

import authRoutes from './routes/auth.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);

app.listen(PORT, ()=>{
  console.log(`Server is running on port: ${PORT}`);
})