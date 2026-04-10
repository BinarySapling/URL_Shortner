import mongoose from 'mongoose';
import env from './env.js';

export const connectDB = async () => {
  await mongoose.connect(env.MONGO_URI, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB connected');
};