const mongoose = require('mongoose')
const { Schema } = mongoose;
const Project = require('./Project');


/* next time, use :

  createdAt: {
    type: Date,
    default: Date.now
  }

*/

const thumbnailsSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
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

module.exports = mongoose.model('Thumbnail', thumbnailsSchema);


/*thumbnailsSchema.virtual("thumbnails", {
    ref : "Project",
    localField : "_id",
    foreignField : "project"
})*/