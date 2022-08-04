const mongoose = require('mongoose')


// THUMBNAILS FOR HOMEPAGE

const thumbnailsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    altText: {
        type: String,
        required: true
    }, 
    imgSrc: {
        type: String,
        required: true
    }, 
    videoSrc: String,
    category: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Thumbnail', thumbnailsSchema);



