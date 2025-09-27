import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    pwd: {
        type: String,
        required: true,
        select: false
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

export default mongoose.model('User', userSchema);

