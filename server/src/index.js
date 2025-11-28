import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';

dotenv.config();

const app = express();

// CORS — allow Netlify + localhost (for development)
app.use(
  cors({
    origin: ['https://herb-heat.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());

// Simple root route so Render won't show "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Herb & Heat API is running 🌿🔥');
});

// Register your routes
app.use('/auth', userRouter);
app.use('/recipes', recipesRouter);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
