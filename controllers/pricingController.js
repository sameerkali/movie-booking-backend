const Movie = require('../models/movieModel');

// Calculate the new price based on booked seats
function calculateNewPrice(movie) {
  const totalSeats = movie.seats.length;
  const bookedSeats = movie.seats.filter(seat => seat.status === 'booked').length;
  const availableSeats = totalSeats - bookedSeats;

  // Price increases by 5% for every booked seat
  const priceIncreaseFactor = 0.05;
  const newPrice = movie.basePrice * (1 + priceIncreaseFactor * bookedSeats);

  return newPrice;
}

// Update the price and notify all clients via Socket.io
exports.updatePrice = async (movieId, io) => { // Pass io from controller
  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      throw new Error('Movie not found');
    }

    // Calculate the new price
    const newPrice = calculateNewPrice(movie);
    movie.currentPrice = newPrice;

    // Save the updated price
    await movie.save();

    // Emit price update to all clients via Socket.io
    if (io) {
      io.emit('priceUpdate', { movieId, newPrice });
    }

    return newPrice;
  } catch (error) {
    throw new Error('Error updating price: ' + error.message);
  }
};
