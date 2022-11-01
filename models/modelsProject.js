const mongoose = require('mongoose')
const { Schema } = mongoose;
const Thumbnail = require('../models/modelsThumbnails')

// FULL PROJECT PAGE

const projectSchema = mongoose.Schema({

    // link project with thumbnail 
    _id : mongoose.Schema.Types.ObjectId,
    thumbnail : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Thumbnail",
        required : true
    },
    category: {
        type: String,
        required: true
    },
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
    /* La vidéo d'entête qui s'affiche en grand */
    main_video: {
        type: String,
        //required: true
    },
    /* Possible 2e video en grand (à part de la gallerie de visuels) selon les projets */
    secondary_video: {
        type: String
    },   
    visuals_array: [String],

    /* plusieurs champs textes de description, car les images vont être réparties sur plusieurs rows */
    visuals_description_1: {
        type: String,
    },
    visuals_description_2: {
        type: String,
    },
    visuals_description_3: {
        type: String,
    },
    visuals_description_4: {
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
