const mongoose = require('mongoose')


// User

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    }, 
    pwd: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Thumbnail', thumbnailsSchema);
