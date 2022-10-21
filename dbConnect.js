const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

/* DB CONNECT */
dbConnect = mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  module.exports = dbConnect;