import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import { userRouter } from './routes/users.js';
import { recipesRouter } from './routes/recipes.js';

dotenv.config();

const app = express();

// CORS before everything
app.use(
  cors({
    origin: 'https://herb-heat.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

// Body parser
app.use(express.json());

// Routes
app.use('/auth', userRouter);
app.use('/recipes', recipesRouter);

// Health
app.get('/', (_req, res) => res.json({ ok: true }));

// DB + Server
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment variables');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
