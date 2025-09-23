// db/dbConnect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default function dbConnect() {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
}
