const mongoose = require('mongoose')


// THUMBNAILS FOR HOMEPAGE

const thumbnailsSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
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
    }
})

module.exports = mongoose.model('Thumbnail', thumbnailsSchema);



