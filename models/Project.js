const mongoose = require('mongoose')
const { Schema } = mongoose;

// PROJECT PAGE

/**
 * array_vids = Main videos (full width on the page)
 * gallery = Gallery of visuals  | 1 to 4 rows of 3 images/videos
 * gallery_row_n_description = text under each rows of visuals 
 */

const projectSchema = mongoose.Schema({

    _id : mongoose.Schema.Types.ObjectId,
    thumbnail : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Thumbnail"
    },/*
    category: {
        type: String,
    },*/
    project_title: {
        type: String,
        required: true,
    }, 
    director: {
        type: String,
        required: true
    },
    other_contributors: { 
        type: String,
    },
    productor: {
        type: String,
    }, 
    // Liens vimeo, max 7 :
    array_vids: { 
        type: [String],
        required: true
    }, 
    video2_description:{
        type: String
    },
    video3_description:{
        type: String
    },
    video4_description:{
        type: String
    },
    video5_description:{
        type: String
    },
    video6_description:{
        type: String
    },
    video7_description:{
        type: String
    },
    // Images ou vids, max 16
    gallery: {  
        type: [String],
        required: true
    },
    gallery_row_1_description: {    
        type: String,
    },
    gallery_row_2_description: {
        type: String,
    },
    gallery_row_3_description: {
        type: String,
    },
    gallery_row_4_description: {
        type: String,
    }
})

module.exports = mongoose.model('Project', projectSchema);




/*
const mySchema = mongoose.Schema({
    image: {
        type: [{ type: String }]
    }
});
*/