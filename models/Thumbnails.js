import mongoose from 'mongoose';

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
        default: Date.now,
        required: true
    },
    // link with project 
    project: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project"
    }
})

export default mongoose.model('Thumbnail', thumbnailsSchema);

