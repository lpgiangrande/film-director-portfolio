const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser') 
const Thumbnail = require('./models/modelsThumbnails')
const animationContent = require('./models/animationContent')
const dbConnect = require('./dbConnect')

/* EJS */
app.set('view engine', 'ejs')

/* GET PUBLIC FILES */
app.use('/public', express.static(path.join(__dirname, 'public')))

/* PORT */
const PORT = process.env.PORT || 4000

 
/* ROUTES */

// HOMEPAGE : display all thumbnails
app.get('/', (req, res) => {
    Thumbnail.find({}, function(err, thumbnails){
        res.render('index', {
            thumbnailsList: thumbnails
        })
    })
})

// PAGE 2 ANIMATION : only display thumbnails with category:animation
app.get('/animation', (req, res) => {
    const query = Thumbnail.find({ 'category': 'animation' });
    query.exec(function(err, thumbnails){
        res.render('animation', {
            thumbnailsList: thumbnails
        })
    })     
})
// SOUS PAGE ANIMATION
app.get('/animation:id', (req, res) => {
    res.render('animation-selected')
      
})
// PAGE 3 LIVE ACTION : only display thumbnails with category: live action
app.get('/liveaction', (req, res) => {
    const query = Thumbnail.find({ 'category': 'live action' });
    query.exec(function(err, thumbnails){
        res.render('liveaction', {
            thumbnailsList: thumbnails
        })
    })   
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