const mongoose = require("mongoose");
const Thumbnail = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject');


/* From the clic on one thumbnail from the Homepage | Animation page 
| live Action page to the project's details page */
exports.seeFullProject = (req, res) => {

    //req.params.id = id du thumbnail
    projectSchema.findOne({ "thumbnail": req.params.id })
        .populate("thumbnail")
        .exec()
        .then(project => {
            res.render('project', { project : project});
            console.log("id du projet : " + project._id);
        })
        .catch(error => {
            console.log(error)
        });
}


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

