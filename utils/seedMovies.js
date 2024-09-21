const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/movieModel');

// Initialize dotenv to access environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateSeats = () => {
  const seats = [];
  for (let i = 1; i <= 200; i++) {
    seats.push({
      number: `A${i}`, 
      status: 'available',
    });
  }
  return seats;
};

// Dummy movie data
const movies = [
  {
    title: 'Movie 1',
    description: 'A fantastic movie about adventure and mystery.',
    showtime: new Date('2024-09-30T18:00:00.000Z'),
    basePrice: 10,
    currentPrice: 10,
    seats: generateSeats(),
  },
  {
    title: 'Movie 2',
    description: 'An exciting sci-fi thriller.',
    showtime: new Date('2024-10-01T20:00:00.000Z'),
    basePrice: 12,
    currentPrice: 12,
    seats: generateSeats(),
  },
  {
    title: 'Movie 3',
    description: 'A heartwarming family drama.',
    showtime: new Date('2024-10-02T16:00:00.000Z'),
    basePrice: 8,
    currentPrice: 8,
    seats: generateSeats(),
  },
];

// Seed movies into the database
const seedMovies = async () => {
  try {
    await Movie.deleteMany(); // Clear the existing movies
    await Movie.insertMany(movies);
    console.log('Movies seeded successfully!');
    mongoose.connection.close(); // Close the DB connection after seeding
  } catch (error) {
    console.error('Error seeding movies:', error);
    mongoose.connection.close();
  }
};

seedMovies();
