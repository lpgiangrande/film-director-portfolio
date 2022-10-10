const mongoose = require("mongoose");
const thumbnailsSchema = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject')
const fs = require("fs");

// Send the data from the uploaded thumbnail from the backoffice form
exports.addThumbnail = (req, res) => {
    const thumbnail = new thumbnailsSchema({
        _id: new mongoose.Types.ObjectId(),
        releaseDate : req.body.release_date,
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

exports.addProject = (req, res) => {
    const project = new projectSchema({
        _id: new mongoose.Types.ObjectId(),
        category : req.body.category,
        main_video : req.files.main_video[0].path,
        project_title : req.body.project_title,
        director : req.body.director,
        other_contributors : req.body.other_contributors,
        productor : req.body.productor,
        img_array_1 : req.files.img_array_1[0].path, // ??
        img_array_1_description: req.body.img_array_1_description,
        img_array_2 : req.files.img_array_2[0].path, // ??
        img_array_2_description: req.body.img_array_2_description,
        img_array_3 : req.files.img_array_3[0].path, // ??
        img_array_3_description: req.body.img_array_3_description,
        secondary_video : req.files.secondary_video[0].path,
        secondary_video_description : req.body.secondary_video_description,
        img_array_4 : req.files.img_array_4[0].path, // ??
        img_array_4_description: req.body.img_array_4_description,
    });
    project.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin');
        })
        .catch(error => {
            console.log(error);
        })
}