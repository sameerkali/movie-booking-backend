const Movie = require('../models/movieModel');
const { updatePrice } = require('./pricingController');

// Fetch all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};



// Get a movie by its ID
exports.getMovieById = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};


exports.reserveSeat = async (req, res) => {
  const { movieId, seatNumber } = req.body;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const seat = movie.seats.find(seat => seat.number === seatNumber);

    if (!seat || seat.status !== 'available') {
      return res.status(400).json({ message: 'Seat is not available' });
    }

    // Reserve the seat
    seat.status = 'reserved';
    await movie.save();

    // Access io object from req.app and emit the seat reservation event to all clients
    const io = req.app.get('io');
    io.emit('seatUpdate', { movieId, seatNumber, status: 'reserved' });

    res.status(200).json({ message: 'Seat reserved successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error reserving seat', error: error.message });
  }
};


// Confirm booking and notify all clients via Socket.io
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

    // Access io object from req.app to use it for real-time communication
    const io = req.app.get('io');

    // Update movie price and emit price update via Socket.io
    const updatedPrice = await updatePrice(movieId, io); // Pass io to updatePrice

    // Emit the seat booking event to all clients
    io.emit('seatUpdate', { movieId, seatNumber, status: 'booked' });

    res.status(200).json({ message: 'Booking confirmed', movie, updatedPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming booking', error: error.message });
  }
};
