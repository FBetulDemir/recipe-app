import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/Users.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await UserModel.findOne({ username });
    if (existing) return res.status(409).json({ message: 'User already exists!' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ username, password: hashed });

    res.status(201).json({ message: 'User registered successfully', user: newUser.username });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid password!' });

    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, userID: user._id, user: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

export { router as userRouter };
