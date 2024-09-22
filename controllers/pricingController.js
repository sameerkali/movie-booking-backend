

const Movie = require('../models/movieModel');

function calculateNewPrice(movie) {
  const bookedSeats = movie.seats.filter(seat => seat.status === 'booked').length;
  const priceIncreaseFactor = 0.05;
  const newPrice = movie.basePrice * (1 + priceIncreaseFactor * bookedSeats);
  return newPrice;
}

exports.updatePrice = async (movieId, io) => { 
  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      throw new Error('Movie not found');
    }

    const newPrice = calculateNewPrice(movie);
    movie.currentPrice = newPrice;

    await movie.save();

    if (io) {
      io.emit('priceUpdate', { movieId, newPrice });
    }

    return newPrice;
  } catch (error) {
    throw new Error('Error updating price: ' + error.message);
  }
};
