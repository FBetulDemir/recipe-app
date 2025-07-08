import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import { UserModel } from '../models/Users.js';


const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, password} = req.body;

    const user = await UserModel.findOne({username: username});

    if (user) {
        return res.json({message: "User already exists!"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
        username,
        password: hashedPassword
    });

    await newUser.save();

    res.json({message: "User registered successfully", user: newUser.username});
})

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = await UserModel.findOne({username})
    if (!user) {
        return res.json({message: "User not found!"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.json({message: "Invalid password!"});
    }

    const token = jwt.sign({id: user._id}, "secret");
    res.json({message: "Login successful", token, userID: user._id, user: user.username});

});

export { router as userRouter};