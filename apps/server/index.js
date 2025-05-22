// Library imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import { connectDB } from './configs/db.js';

// Local imports

// Init. config for .env
dotenv.config();
connectDB();
// Custome Middlewares


const app = express();
const PORT = 3300 || process.env.PORT;

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
