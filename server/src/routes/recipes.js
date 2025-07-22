import {RecipeModel} from '../models/Recipes.js';
import express from "express";
import mongoose from "mongoose";
import { UserModel } from '../models/Users.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({})
        res.json(response)
    } catch (error) {
        res.json(error)
    }
})

router.post("/", async (req, res) => {
    const recipe = new RecipeModel(req.body);

    try {
        const response = await recipe.save();
        res.json(response);
    } catch (error) {
        res.json(error)
    }
})

router.put("/", async (req, res) => {
    try {
        const { recipeID, userID } = req.body;

        const user = await UserModel.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });


        if (!user.savedRecipes.includes(recipeID)) {
            user.savedRecipes.push(recipeID);
            await user.save();
        }

        res.json({ savedRecipes: user.savedRecipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedRecipes: user?.savedRecipes})

    }catch (error) {
        res.json(error)
    }
})

router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes }
        });

        res.json({ savedRecipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put("/unsave", async (req, res) => {
  const { recipeID, userID } = req.body;

  try {
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeID);
    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export {router as recipesRouter};