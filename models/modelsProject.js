const mongoose = require('mongoose')
const { Schema } = mongoose;

// FULL PROJECT PAGE

/**
 * array_vids = Main videos (full width on the page)
 * gallery = Gallery of visuals  | 1 to 4 rows of 3 images/videos
 * gallery_row_n_description = text under each rows of visuals 
 */

const projectSchema = mongoose.Schema({

    // link project with thumbnail 
    _id : mongoose.Schema.Types.ObjectId,
    thumbnail : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Thumbnail",
        required : true
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
    array_vids: { // main vids, 1 or 2
        type: [String],
        required: true
    }, 
    gallery: {  // img, sometimes vids
        type: [String],
        required: true
    },
    vid_description:{
        type: String,
    },
    gallery_row_1_description: {    
        type: String,
    },
    gallery_row_2_description: {
        type: String,
    },
    gallery_row_3_description: {
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
