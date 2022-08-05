const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ejs = require('ejs')
const path = require('path')
const bodyParser = require('body-parser') 
const Thumbnail = require('./models/modelsThumbnails')
//const Project = require('./models/modelsProject')
const dbConnect = require('./dbConnect')

/* EJS */
app.set('view engine', 'ejs')

/* GET PUBLIC FILES */
app.use('/public', express.static(path.join(__dirname, 'public')))

/* PORT */
const PORT = process.env.PORT || 4000

// ?
app.use(bodyParser.urlencoded({extended:false}));
 
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

// PAGE HOMEPAGE TO PROJET : display project details when you clic on a homepage thumbnail
app.get('/:id', (req, res) => {
    Thumbnail.findById(req.params.id)
    .exec()
    .then(thumbnails => {
        res.render('project', {
            thumbnailsList: thumbnails
        })
    })
    .catch(error =>{
        console.log(error);
    })   
})



// routes
//app.use("/", router);

/*app.listen(4000, function(){
    console.log('server is running')
})*/
app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
  })



// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim