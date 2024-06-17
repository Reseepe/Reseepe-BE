const express = require('express');
const RecipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/search', RecipeController.searchIngredients);
router.get('/recommended', RecipeController.getRecommendedRecipes);
router.get('/bookmarked', authMiddleware, RecipeController.getBookmarkedRecipes);

router.post('/bookmark/:recipeId', authMiddleware, RecipeController.addBookmark);
router.post('/recipes', authMiddleware, RecipeController.getScannedRecipes);

// development only
router.get('/recipes', RecipeController.getRecipes);
router.post('/recipestest', RecipeController.getRecipesTest);

module.exports = router;