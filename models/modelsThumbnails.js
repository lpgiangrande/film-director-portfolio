const mongoose = require('mongoose')
const { Schema } = mongoose;
//const projectSchema = require('../models/modelsProject');
//const Project = require('../models/modelsProject');

// THUMBNAILS FOR HOMEPAGE

const thumbnailsSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    releaseDate: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
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
    //lier Thumbnail:id à project:id ?
    project: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
    //The ref option is what tells Mongoose which model to use during population
})
//thumbnail.find({}).populate('project').exec();

module.exports = mongoose.model('Thumbnail', thumbnailsSchema);



