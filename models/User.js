const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
//max 2 users
userSchema.statics.countUsers = function () {
    return this.countDocuments();
};

module.exports = mongoose.model('User', userSchema);

