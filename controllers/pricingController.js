const Movie = require('../models/movieModel');


function calculateNewPrice(movie) {
  const totalSeats = movie.seats.length;
  const bookedSeats = movie.seats.filter(seat => seat.status === 'booked').length;
  const availableSeats = totalSeats - bookedSeats;

  const priceIncreaseFactor = 0.05;
  const newPrice = movie.basePrice * (1 + priceIncreaseFactor * bookedSeats);

  return newPrice;
}

exports.updatePrice = async (movieId) => {
  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      throw new Error('Movie not found');
    }

    movie.currentPrice = calculateNewPrice(movie);

    await movie.save();

    return movie.currentPrice;
  } catch (error) {
    throw new Error('Error updating price: ' + error.message);
  }
};
