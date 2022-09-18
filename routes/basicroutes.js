/* Routes for the 4 main pages */

const express = require("express");
const router = express.Router();
const Thumbnail = require('../models/modelsThumbnails');
const ejs = require('ejs');


// HOME PAGE
router.get('/', (req, res) => {
    Thumbnail.find({}, function(err, thumbnails){
        res.render('index', {thumbnailsList: thumbnails })
    })  
});

// PAGE 2 ANIMATION : only display thumbnails with category:animation
router.get('/animation', (req, res) => {
    const query = Thumbnail.find({ 'category': 'animation' })
    query.exec(function(err, thumbnails){
        res.render('animation', {
            thumbnailsList: thumbnails
        })
    })     
});

// PAGE 3 LIVE ACTION : only display thumbnails with category: live action
router.get('/liveaction', (req, res) => {
    const query = Thumbnail.find({ 'category': 'live action' })
    query.exec(function(err, thumbnails){
        res.render('liveaction', {
            thumbnailsList: thumbnails
        })
    })   
});

// PAGE 4 ABOUT
router.get('/about', (req, res) => {
    res.render('about')
});


// Display project details when you clic on a homepage thumbnail
router.get('/:id', (req, res) => {
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


module.exports = router;


