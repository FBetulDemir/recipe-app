import express from 'express';
import { RecipeModel } from '../models/Recipes.js';
import { UserModel } from '../models/Users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public: list all recipes
router.get('/', async (_req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected: create recipe (owner from token)
router.post('/', verifyToken, async (req, res) => {
  try {
    const recipe = new RecipeModel({ ...req.body, userOwner: req.userId });
    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected: save recipe for logged-in user
router.put('/', verifyToken, async (req, res) => {
  try {
    const { recipeID } = req.body;
    const userID = req.userId;

    if (!recipeID) return res.status(400).json({ message: 'recipeID required' });

    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedRecipes.includes(recipeID)) {
      user.savedRecipes.push(recipeID);
      await user.save();
    }

    res.json({ savedRecipes: user.savedRecipes.map((id) => id.toString()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected: get saved IDs (prevents reading others' lists without token)
router.get('/savedRecipes/ids/:userID', verifyToken, async (req, res) => {
  try {
    if (req.userId !== req.params.userID) return res.status(403).json({ message: 'Forbidden' });

    const user = await UserModel.findById(req.params.userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ savedRecipes: user.savedRecipes.map((id) => id.toString()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected: expand saved IDs to full docs (also restricted to self)
router.get('/savedRecipes/:userID', verifyToken, async (req, res) => {
  try {
    if (req.userId !== req.params.userID) return res.status(403).json({ message: 'Forbidden' });

    const user = await UserModel.findById(req.params.userID);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const savedRecipes = await RecipeModel.find({ _id: { $in: user.savedRecipes } });
    res.json({ savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected: unsave
router.put('/unsave', verifyToken, async (req, res) => {
  try {
    const { recipeID } = req.body;
    if (!recipeID) return res.status(400).json({ message: 'recipeID required' });

    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipeID);
    await user.save();

    res.json({ savedRecipes: user.savedRecipes.map((id) => id.toString()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as recipesRouter };
