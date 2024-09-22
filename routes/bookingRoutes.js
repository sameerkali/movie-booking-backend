const express = require('express');
const { getMovies, reserveSeat, confirmBooking, getMovieById, cancelReservation } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/movies', getMovies);
router.get('/movies/:id', getMovieById); 
router.post('/reserve', authMiddleware(), reserveSeat);
router.post('/confirm', authMiddleware(), confirmBooking);

router.post('/cancel-reserve', authMiddleware(), cancelReservation); //no need for this 


module.exports = router;
