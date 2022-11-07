const mongoose = require("mongoose");
const Thumbnail = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject');


exports.homePage = (req, res) => {
    Thumbnail.find({}, function(err, thumbnails){
        res.render('index', { thumbnailsList: thumbnails })
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
    const query = Thumbnail.find({ 'category': 'liveaction' })
    query.exec(function(err, thumbnails){
        res.render('liveaction', {
            thumbnailsList: thumbnails
        })
    })      
};

/* 
From thumbnail clic to project details page 
--> If img gallery nb = odd, render template 1
--> If img gallery nb = even, render template 2
*/
exports.seeFullProject = (req, res) => {

    //req.params.id = id du thumbnail
    projectSchema.findOne({ "thumbnail": req.params.id })
        //.populate("thumbnail")
        .exec()
        .then(project => {

            ( project.gallery.length % 2 === 0 ) ? 
                res.render('project_v2', { project : project})
                : res.render('project', { project : project});
            
            console.log( "nb d'images : ", project.gallery.length);
            
            //console.log("id du projet : " + project._id);
        })
        .catch(error => {
            console.log(error)
        });
}

exports.aboutPage = (req, res) => {
    res.render('about')
};
