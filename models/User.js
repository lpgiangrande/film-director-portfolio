const mongoose = require('mongoose')

// User

const userSchema = mongoose.Schema({
   // _id : mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    }, 
    pwd: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.statics.countUsers = function () {
    return this.countDocuments();
};

module.exports = mongoose.model('User', userSchema);
