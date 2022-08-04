const mongoose = require('mongoose')

// VIDEOS FOR ANIMATION PAGE

const animationVideoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    subTitle1: {
        type: String,
        required: true
    }, 
    subTitle2: {
        type: String,
    }, 
    subTitle3: {
        type: String,
    }
})


// IMAGES FOR ANIMATION PAGE
const animationImgSchema = mongoose.Schema({
    imgSrc: {
        type: String,
        required: true
    }
})

// TEXTS FOR ANIMATION PAGE
const animationTxtSchema = mongoose.Schema({
    description1: {
        type: String,
    },
    description2: {
        type: String,
    },
    description3: {
        type: String,
    }
})

module.exports = mongoose.model('animationVideo', animationVideoSchema);
module.exports = mongoose.model('animationImg', animationImgSchema);
module.exports = mongoose.model('animationTxt', animationTxtSchema);



