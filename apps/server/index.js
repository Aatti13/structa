// Library imports
import express from 'express';
import dotenv from 'dotenv';

// Local imports

// Init. config for .env
dotenv.config();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custome Middlewares


const app = express();
const PORT = 3300 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
