const mongoose = require("mongoose");
const thumbnailsSchema = require('../models/modelsThumbnails');
const fs = require("fs");

// Send the data from the uploaded thumbnail from the backoffice form
exports.addThumbnail = (req, res) => {
    const thumbnail = new thumbnailsSchema({
        _id: new mongoose.Types.ObjectId(),
        title : req.body.title_thumbnail,
        category : req.body.category,
        imgSrc : req.files.img_thumbnail[0].path,
        videoSrc : req.files.vid_thumbnail[0].path
    });
    thumbnail.save()
    .then(result => {
        console.log(result);
        res.redirect('/admin');
    })
    .catch(error => {
        console.log(error);
    })
}