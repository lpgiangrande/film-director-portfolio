const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ejs = require('ejs')
const path = require('path') 

app.set('view engine', 'ejs')

app.use('/public', express.static(path.join(__dirname, 'public')))


mongoose.connect('mongodb+srv://user1:useruser@cluster0.4k6lx.mongodb.net/siteregis?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 
  // model
const thumbnailsSchema = {
    title: String,
    altText: String,
    url: String,
    category: String
}

const Thumbnail = mongoose.model('Thumbnail', thumbnailsSchema);
// model

app.get('/', (req, res) => {
    Thumbnail.find({}, function(err, thumbnails){
        res.render('index', {
            thumbnailsList: thumbnails
        })
    })
})

app.listen(4000, function(){
    console.log('server is running')
})



// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim