import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  const uri = mongoUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SANSKRUTEE';
  console.log('Connecting to MongoDB at:', uri);
  if (!uri) {
    throw new Error('Missing MongoDB connection string');
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

export default connectDB;