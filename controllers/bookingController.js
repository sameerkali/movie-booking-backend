const Movie = require('../models/movieModel');
const { updatePrice } = require('./pricingController');

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

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

    seat.status = 'reserved';
    await movie.save();

    const io = req.app.get('io');
    io.emit('seatUpdate', { movieId, seatNumber, status: 'reserved' });

    // Set a timeout to make the seat available after 2 minutes
    setTimeout(async () => {
      const updatedMovie = await Movie.findById(movieId);
      const updatedSeat = updatedMovie.seats.find(seat => seat.number === seatNumber);
      if (updatedSeat && updatedSeat.status === 'reserved') {
        updatedSeat.status = 'available';
        await updatedMovie.save();
        io.emit('seatUpdate', { movieId, seatNumber, status: 'available' });
      }
    }, 120000); // 2 min

    res.status(200).json({ message: 'Seat reserved successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error reserving seat', error: error.message });
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

    seat.status = 'booked';
    await movie.save();

    const io = req.app.get('io');
    const updatedPrice = await updatePrice(movieId, io);
    io.emit('seatUpdate', { movieId, seatNumber, status: 'booked' });

    res.status(200).json({ message: 'Booking confirmed', movie, updatedPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming booking', error: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
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

    seat.status = 'available';
    await movie.save();

    const io = req.app.get('io');
    io.emit('seatUpdate', { movieId, seatNumber, status: 'available' });

    res.status(200).json({ message: 'Reservation cancelled successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
  }
};
