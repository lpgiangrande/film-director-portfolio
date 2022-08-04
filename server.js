const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser') 
const Thumbnail = require('./models/models');

/* EJS */
app.set('view engine', 'ejs')

/* GET PUBLIC FILES */
app.use('/public', express.static(path.join(__dirname, 'public')))

/* PORT */
const PORT = process.env.PORT || 4000

/* DB CONNECT */
mongoose.connect('mongodb+srv://user1:useruser@cluster0.4k6lx.mongodb.net/siteregis?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 
/* ROUTES */

// HOMEPAGE ROUTE TEST WITH EJS
app.get('/', (req, res) => {
    Thumbnail.find({}, function(err, thumbnails){
        res.render('index', {
            thumbnailsList: thumbnails
        })
    })
})

// PAGE 2 ANIMATION
app.get('/animation', (req, res) => {
        res.render('animation')
          
})
// PAGE 3 LIVE ACTION
app.get('/liveaction', (req, res) => {
    res.render('liveaction')
      
})
// PAGE 4 ABOUT
app.get('/about', (req, res) => {
    res.render('about')
      
})

/*app.listen(4000, function(){
    console.log('server is running')
})*/
app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
  })



// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim