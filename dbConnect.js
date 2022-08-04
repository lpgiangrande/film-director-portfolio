const mongoose = require('mongoose')

/* DB CONNECT */
dbConnect = mongoose.connect('mongodb+srv://user1:useruser@cluster0.4k6lx.mongodb.net/siteregis?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  module.exports = dbConnect;