// server/src/routes/recipes.js
import express from 'express';
import { RecipeModel } from '../models/Recipes.js';
import { UserModel } from '../models/Users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// --- Public: list all recipes ---
router.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Protected: create a recipe (owner from token) ---
router.post('/', verifyToken, async (req, res) => {
  try {
    const recipe = new RecipeModel({ ...req.body, userOwner: req.userId });
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Protected: save a recipe for the logged-in user ---
router.put('/', verifyToken, async (req, res) => {
  const { recipeID } = req.body;
  const userID = req.userId; // <- from JWT

  if (!recipeID) return res.status(400).json({ message: 'recipeID required' });

  try {
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedRecipes.includes(recipeID)) {
      user.savedRecipes.push(recipeID);
      await user.save();
    }
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- (Optional public) get saved IDs by user id param ---
router.get('/savedRecipes/ids/:userID', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user ? user.savedRecipes : [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Public: expand saved IDs to full recipe docs ---
router.get('/savedRecipes/:userID', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const savedRecipes = await RecipeModel.find({ _id: { $in: user.savedRecipes } });
    res.json({ savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Protected: unsave a recipe for the logged-in user ---
router.put('/unsave', verifyToken, async (req, res) => {
  const { recipeID } = req.body;
  const userID = req.userId; // <- from JWT

  if (!recipeID) return res.status(400).json({ message: 'recipeID required' });

  try {
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeID);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as recipesRouter };
