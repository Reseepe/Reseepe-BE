const express = require('express');
const RecipeController = require('../controllers/recipeController');
const ScanController = require('../controllers/scanController');
const authMiddleware = require('../middleware/auth');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/search', RecipeController.searchIngredients);
router.get('/recommended', authMiddleware, RecipeController.getRecommendedRecipes);
router.get('/bookmarked', authMiddleware, RecipeController.getBookmarkedRecipes);

router.post('/bookmark/:recipeId', authMiddleware, RecipeController.addBookmark);
router.post('/unbookmark/:recipeId', authMiddleware, RecipeController.removeBookmark);
router.post('/recipes', authMiddleware, RecipeController.getScannedRecipes);

router.post('/ingredient', upload.single('photo'), ScanController.getIngredientsFromPhoto);
router.post('/ingredientTest', ScanController.getIngredientsFromPhotoTest);

// development only
router.get('/recipes', RecipeController.getRecipes);
router.post('/recipestest', RecipeController.getRecipesTest);

module.exports = router;