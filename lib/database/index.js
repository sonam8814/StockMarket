import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (isConnected) {
    console.log('=> using existing database connection');
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'stockmarket',
      bufferCommands: false,
    });

    isConnected = true;
    console.log('=> new database connection established');
    return conn.connection;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};