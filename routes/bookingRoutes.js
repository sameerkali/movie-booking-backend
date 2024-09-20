const express = require('express');
const { getMovies, reserveSeat, confirmBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Fetch all movies
router.get('/movies', getMovies);

// Reserve a seat (protected route)
router.post('/reserve', authMiddleware(), reserveSeat);

// Confirm booking (protected route)
router.post('/confirm', authMiddleware(), confirmBooking);

module.exports = router;
