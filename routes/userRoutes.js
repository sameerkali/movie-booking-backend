const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user (protected)
router.get('/me', authMiddleware(), getCurrentUser);

module.exports = router;
