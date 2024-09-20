const Movie = require('../models/movieModel');

// Function to calculate new price based on the number of available seats
function calculateNewPrice(movie) {
  const totalSeats = movie.seats.length;
  const bookedSeats = movie.seats.filter(seat => seat.status === 'booked').length;
  const availableSeats = totalSeats - bookedSeats;

  // Increase price by 5% every time a seat is booked
  const priceIncreaseFactor = 0.05;
  const newPrice = movie.basePrice * (1 + priceIncreaseFactor * bookedSeats);

  return newPrice;
}

// Update movie price after booking
exports.updatePrice = async (movieId) => {
  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      throw new Error('Movie not found');
    }

    // Calculate new price
    movie.currentPrice = calculateNewPrice(movie);

    // Save updated movie with new price
    await movie.save();

    return movie.currentPrice;
  } catch (error) {
    throw new Error('Error updating price: ' + error.message);
  }
};
