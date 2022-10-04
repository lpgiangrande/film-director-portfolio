const mongoose = require('mongoose')
const { Schema } = mongoose;
// const ThumbnailsSchema = require('models/modelsThumbnails.js')
//const Thumbnail = require('models/modelsThumbnails')

// FULL PROJECT PAGE

const projectSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    // link project with thumbnail 
    thumbnail: [
        { type: Schema.Types.ObjectId, ref: 'Thumbnail' 
    }],
    category: {
        type: String,
        required: true
    },
    main_video: {
        type: String,
        required: true
    },
    project_title: {
        type: String,
        required: true
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
    visuals_array_1: [
        {
            type: String,
            required: true
        },
        /*{ _id: false }*/
    ],
    visuals_array_1_description:{
        type: String,
    },
    visuals_array_2:[
        {
            type: String
        },
        /*{ _id: false }*/
    ],
    visuals_array_2_description:{
            type: String
        },
        /*{ _id: false }*/
    visuals_array_3: [
        {
            type: String
        },
        /*{ _id: false }*/
    ],
    visuals_array_3_description:{
        type: String,
    },
    secondary_video: {
        type: String,
    },
    secondary_video_description: {
        type: String,
    },
    visuals_array_4: [
        {
            type: String
        },
        /*{ _id: false }*/
    ],
    visuals_array_4_description:{
        type: String,
    }
})

module.exports = mongoose.model('Project', projectSchema);


