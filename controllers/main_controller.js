const mongoose = require("mongoose");
const Thumbnail = require('../models/modelsThumbnails');


exports.homePage = (req, res) => {
    Thumbnail.find({}, function(err, thumbnails){
        res.render('index', {thumbnailsList: thumbnails })
    })   
};

exports.animationPage = (req, res) => {
    const query = Thumbnail.find({ 'category': 'animation' })
    query.exec(function(err, thumbnails){
        res.render('animation', {
            thumbnailsList: thumbnails
        })
    })     
};

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

exports.projectFromHomePage = (req, res) => {
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
}
