const Movie = require('../models/movieModel');
const { updatePrice } = require('./pricingController'); 
const socketIO = require('socket.io');
let io;

// Fetch available movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

// Select a seat and reserve it (real-time seat reservation)
exports.reserveSeat = async (req, res) => {
  const { movieId, seatNumber } = req.body;

  try {
    const movie = await Movie.findById(movieId);

    // Check if the movie exists
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Find the seat in the movie's seats array
    const seat = movie.seats.find(seat => seat.number === seatNumber);

    // Check if the seat is available
    if (!seat || seat.status !== 'available') {
      return res.status(400).json({ message: 'Seat is not available' });
    }

    // Reserve the seat
    seat.status = 'reserved';

    // Save the movie with the updated seat status
    await movie.save();

    res.status(200).json({ message: 'Seat reserved successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error reserving seat', error: error.message });
  }
};

// Confirm booking (finalize reservation)
exports.confirmBooking = async (req, res) => {
  const { movieId, seatNumber } = req.body;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const seat = movie.seats.find(seat => seat.number === seatNumber);

    if (!seat || seat.status !== 'reserved') {
      return res.status(400).json({ message: 'Seat is not reserved or already booked' });
    }

    // Mark the seat as booked
    seat.status = 'booked';

    await movie.save();

    res.status(200).json({ message: 'Booking confirmed', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming booking', error: error.message });
  }
};




exports.confirmBooking = async (req, res) => {
    const { movieId, seatNumber } = req.body;
  
    try {
      const movie = await Movie.findById(movieId);
  
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      const seat = movie.seats.find(seat => seat.number === seatNumber);
  
      if (!seat || seat.status !== 'reserved') {
        return res.status(400).json({ message: 'Seat is not reserved or already booked' });
      }
  
      // Mark the seat as booked
      seat.status = 'booked';
      await movie.save();
  
      // Update movie price after booking
      const updatedPrice = await updatePrice(movieId);
  
      // Emit price update to all connected clients
      io.emit('priceUpdate', { movieId, updatedPrice });
  
      res.status(200).json({ message: 'Booking confirmed', movie, updatedPrice });
    } catch (error) {
      res.status(500).json({ message: 'Error confirming booking', error: error.message });
    }
  };