const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/movieModel');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateSeats = () => {
  const seats = [];
  for (let i = 1; i <= 60; i++) {
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
    title: 'Deadpool & Wolverine',
    description: 'Marvel Studios Deadpool & Wolverine delivers the ultimate team-up throwdown on July 26..',
    showtime: new Date('2024-09-30T18:00:00.000Z'),
    basePrice: 200,
    currentPrice: 200,
    seats: generateSeats(),
  },
  {
    title: 'Despicable Me 4',
    description: 'In the first Despicable Me movie in seven years, Gru, the worlds favorite supervillain-turned-Anti-Villain League-agent.',
    showtime: new Date('2024-10-01T20:00:00.000Z'),
    basePrice: 120,
    currentPrice: 120,
    seats: generateSeats(),
  },
  {
    title: 'Am I Racist?',
    description: 'Daily Wire host and filmmaker Matt Walsh transforms himself into a certified diversity, equity, and inclusion expert.',
    showtime: new Date('2024-10-02T16:00:00.000Z'),
    basePrice: 800,
    currentPrice: 800,
    seats: generateSeats(),
  },
];

// Seed the movies 
const seedMovies = async () => {
  try {
    await Movie.deleteMany(); 
    await Movie.insertMany(movies);
    console.log('Movies seeded successfully!');
    mongoose.connection.close(); 
  } catch (error) {
    console.error('Error seeding movies:', error);
    mongoose.connection.close();
  }
};

seedMovies();
