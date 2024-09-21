const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'booked'],
    default: 'available',
  },
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  showtime: {
    type: Date,
    required: true,
  },
  seats: [seatSchema],
  basePrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.basePrice;
    },
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
