import mongoose from 'mongoose';
import appEnv from '@utils/appEnv';

export const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(appEnv('MONGODB_URI'));
    console.log('App Connected to MongoDB');
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
