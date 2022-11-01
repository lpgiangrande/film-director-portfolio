const mongoose = require('mongoose')
const { Schema } = mongoose;
//const projectSchema = require('models/modelsProject');
const Project = require('../models/modelsProject');


// THUMBNAILS FOR HOMEPAGE

const thumbnailsSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true//,
        //project : {type: mongoose.Types.ObjectId, ref: "Project"}
    }, 
    altText: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    imgSrc: {
        type: String,
        required: true
    }, 
    videoSrc: {
        type : String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    // link with project 
    project: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project"
    }
})

/*thumbnailsSchema.virtual("thumbnails", {
    ref : "Project",
    localField : "_id",
    foreignField : "project"
})*/

module.exports = mongoose.model('Thumbnail', thumbnailsSchema);



