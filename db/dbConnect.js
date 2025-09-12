// db/dbConnect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default function dbConnect() {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.error('Connexion à MongoDB échouée !', err));
}
