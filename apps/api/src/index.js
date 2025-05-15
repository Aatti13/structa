// Library imports
import expres from "express";
import dotenv from 'dotenv';

// Component Imports
import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app = expres();
const PORT = 3300 || process.env.PORT;

// connectDB();

app.use(expres.json());
app.use(expres.urlencoded({extended: true}));

app.use('/api/auth', authRoutes);

app.listen(PORT, ()=>{
  console.log(`PORT: ${PORT}`)
});
