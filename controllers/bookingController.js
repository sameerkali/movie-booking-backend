const Movie = require('../models/movieModel');
const { updatePrice } = require('./pricingController'); 
const socketIO = require('socket.io');
let io;


exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
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

      seat.status = 'booked';
      await movie.save();
  

      const updatedPrice = await updatePrice(movieId);

      io.emit('priceUpdate', { movieId, updatedPrice });
  
      res.status(200).json({ message: 'Booking confirmed', movie, updatedPrice });
    } catch (error) {
      res.status(500).json({ message: 'Error confirming booking', error: error.message });
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