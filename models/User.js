const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


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

/*
userSchema.pre('save', async function(next) {
    try {
        // check method of registration
        const user = this;
        if (!user.isModified('password')) next();
        // generate salt
        const salt = await bcrypt.genSalt(10);
        // hash the password
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // replace plain text password with hashed password
        this.password = hashedPassword;
        next();
        } 
    catch (error) {
        return next(error);
    }
});

userSchema.methods.matchPassword = async function (pwd) {
    try {
        return await bcrypt.compare(pwd, this.pwd);
        } 
    catch (error) {
        throw new Error(error);
    }
};
*/

module.exports = mongoose.model('User', userSchema);
