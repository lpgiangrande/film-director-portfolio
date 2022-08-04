const mongoose = require('mongoose')


// MODEL - THUMBNAILS FOR HOMEPAGE

const thumbnailsSchema = {
    title: String,
    altText: String,
    src: String,
    category: String
}

module.exports = mongoose.model('Thumbnail', thumbnailsSchema);

//

