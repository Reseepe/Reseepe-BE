const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { validateUser, validateLogin } = require('../middleware/validate');

const router = express.Router();

router.get('/profile/:id', UserController.getUserById);
router.get('/users/:email', UserController.getUserByEmail);
router.get('/profile', authMiddleware, UserController.getProfile);

router.post('/register', validateUser,UserController.createUser);
router.post('/login', validateLogin,UserController.login);
router.post('/changespass', authMiddleware, UserController.changePassword);

router.put('/profile/edit', authMiddleware, UserController.updateUser);

module.exports = router;