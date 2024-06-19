const express = require('express');
const RecipeController = require('../controllers/recipeController');
const scanController = require('../controllers/scanController');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/search', RecipeController.searchIngredients);
router.get('/recommended', authMiddleware, RecipeController.getRecommendedRecipes);
router.get('/bookmarked', authMiddleware, RecipeController.getBookmarkedRecipes);

router.post('/bookmark/:recipeId', authMiddleware, RecipeController.addBookmark);
router.post('/unbookmark/:recipeId', authMiddleware, RecipeController.removeBookmark);
router.post('/recipes', authMiddleware, RecipeController.getScannedRecipes);

router.post('/ingredient', upload.single('photo'), scanController.getIngredientsFromPhoto);

// development only
router.get('/recipes', RecipeController.getRecipes);
router.post('/recipestest', RecipeController.getRecipesTest);

module.exports = router;