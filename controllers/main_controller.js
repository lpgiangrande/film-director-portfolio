const mongoose = require("mongoose");
const Thumbnail = require('../models/modelsThumbnails');


exports.homePage = (req, res) => {
    Thumbnail.find({}, function(err, thumbnails){
        res.render('index', {thumbnailsList: thumbnails })
    })   
};

// Order thumbnails by category for the Animation page
exports.animationPage = (req, res) => {
    const query = Thumbnail.find({ 'category': 'animation' })
    query.exec(function(err, thumbnails){
        res.render('animation', {
            thumbnailsList: thumbnails
        })
    })     
};

// Order thumbnails by category for the Liveaction page
exports.liveActionPage = (req, res) => {
    const query = Thumbnail.find({ 'category': 'live action' })
    query.exec(function(err, thumbnails){
        res.render('liveaction', {
            thumbnailsList: thumbnails
        })
    })      
};

exports.aboutPage = (req, res) => {
    res.render('about')
};

/* From the clic on one thumbnail from the Hompage | Animation page 
| live Action page to the project's details page */
exports.seeFullProject = (req, res) => {
    Thumbnail.findById(req.params.id)
    .exec()
    .then(thumbnails => {
        res.render('project', {
            thumbnailsList: thumbnails
        })
        // LIER AVEC LE PROJET CORRESPONDANT ?
    })
    .catch(error =>{
        console.log(error);
    })   
}
