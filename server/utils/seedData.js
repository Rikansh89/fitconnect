const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const sampleUsers = [
  {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    password: 'password123',
    age: 22,
    gender: 'male',
    city: 'Mumbai',
    fitnessGoal: 'muscle_gain',
    experienceLevel: 'intermediate',
    preferredWorkoutTime: 'morning',
    gymName: 'Cult Fit Andheri',
    bio: 'Looking for a consistent gym partner for morning workouts.',
  },
  {
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    age: 21,
    gender: 'female',
    city: 'Mumbai',
    fitnessGoal: 'weight_loss',
    experienceLevel: 'beginner',
    preferredWorkoutTime: 'evening',
    gymName: 'Gold Gym Malad',
    bio: 'New to fitness, looking for someone to guide me.',
  },
  {
    name: 'Amit Singh',
    email: 'amit@example.com',
    password: 'password123',
    age: 24,
    gender: 'male',
    city: 'Delhi',
    fitnessGoal: 'muscle_gain',
    experienceLevel: 'advanced',
    preferredWorkoutTime: 'morning',
    gymName: 'Anytime Fitness Delhi',
    bio: 'Advanced lifter, want to compete someday.',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha@example.com',
    password: 'password123',
    age: 23,
    gender: 'female',
    city: 'Bangalore',
    fitnessGoal: 'general_fitness',
    experienceLevel: 'intermediate',
    preferredWorkoutTime: 'afternoon',
    gymName: 'Cult Fit Koramangala',
    bio: 'Just want to stay fit and make gym friends.',
  },
  {
    name: 'Vikram Joshi',
    email: 'vikram@example.com',
    password: 'password123',
    age: 25,
    gender: 'male',
    city: 'Pune',
    fitnessGoal: 'endurance',
    experienceLevel: 'beginner',
    preferredWorkoutTime: 'evening',
    gymName: 'Fitness First Pune',
    bio: 'Training for my first marathon.',
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya@example.com',
    password: 'password123',
    age: 20,
    gender: 'female',
    city: 'Delhi',
    fitnessGoal: 'flexibility',
    experienceLevel: 'beginner',
    preferredWorkoutTime: 'morning',
    gymName: 'YogaFit Delhi',
    bio: 'Yoga and flexibility training enthusiast.',
  },
  {
    name: 'Arjun Nair',
    email: 'arjun@example.com',
    password: 'password123',
    age: 26,
    gender: 'male',
    city: 'Bangalore',
    fitnessGoal: 'muscle_gain',
    experienceLevel: 'intermediate',
    preferredWorkoutTime: 'night',
    gymName: 'AnyTime Fitness Indiranagar',
    bio: 'Night owl who loves lifting heavy.',
  },
  {
    name: 'Neha Verma',
    email: 'neha@example.com',
    password: 'password123',
    age: 22,
    gender: 'female',
    city: 'Mumbai',
    fitnessGoal: 'weight_loss',
    experienceLevel: 'intermediate',
    preferredWorkoutTime: 'evening',
    gymName: 'Gold Gym Bandra',
    bio: 'Consistent for 6 months, need a partner to push harder.',
  },
];

async function seedUsers() {
  try {
    await User.deleteMany({});
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        u.password = await bcrypt.hash(u.password, salt);
        return u;
      })
    );
    await User.insertMany(hashedUsers);
    console.log('Sample users created successfully');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

module.exports = { seedUsers };
