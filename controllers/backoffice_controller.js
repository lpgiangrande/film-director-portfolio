const mongoose = require("mongoose");
const thumbnailsSchema = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject')
const fs = require("fs");


/*
 Multer notes :

    // req.files = array
    // req.files['avatar'][0] -> File
    // req.files['gallery'] -> Array

    // upload.any(), backofficeController.addProject);
    // upload.array('visuals_array_1', 3), backofficeController.addProject);
    // upload.fields([{ name :'main_video', maxCount: 1 }]), backofficeController.addProject); ])
*/


/* 1er formulaire  */
exports.addProject =  (req, res) => {

    let array_files = req.files;
    let visuals = array_files.map(a => a.path);

    const project = new projectSchema({

        _id: new mongoose.Types.ObjectId(),
        thumbnail : req.body.linkedThumbnail,
        category : req.body.category,
        project_title : req.body.project_title,
        director : req.body.director,
        other_contributors : req.body.other_contributors,
        productor : req.body.productor,
        main_video : req.files.main_video[0].path, 
        secondary_video : req.files.secondary_video[0].path,
        //secondary_video_description: req.body.secondary_video_description
        
        visuals_array : visuals,
        visuals_description_1 : req.body.visuals_description_1,
        visuals_description_2 : req.body.visuals_description_2,
        visuals_description_3 : req.body.visuals_description_3,
        visuals_description_4 : req.body.visuals_description_4        
    })

    console.log(project);
    project.save()
    .then(result => {
        console.log(result);
        console.log(req.body.thumbnail);
    })
    .catch(error => {
        console.log(error);
    })
}


// Send the data from the uploaded thumbnail from the backoffice form
exports.addThumbnail = (req, res) => {
    const thumbnail = new thumbnailsSchema({
        _id: new mongoose.Types.ObjectId(),
        releaseDate : req.body.release_date,
        title : req.body.title_thumbnail,
        category : req.body.category,
        imgSrc : req.files.img_thumbnail[0].path,
        videoSrc : req.files.vid_thumbnail[0].path
    });
    thumbnail.save()
        .then(result => {
            console.log(result);
            res.redirect('/admin');
        })
        .catch(error => {
            console.log(error);
        })
}




/*exports.seeProjectFromAdmin = (req, res) => {
    projectSchema.findOne({ "thumbnail": req.params.id })
        .populate("thumbnail")
        .exec()
        .then(project => {
            res.render('project', { project : project});
            console.log("id du projet : " + project._id);
        })
        .catch(error => {
            console.log(error)
        });
}*/

// Lister les projets | page "projects_list"
exports.projectsList = (req, res) => {
    projectSchema.find({}, function(err, projects) {
            res.render('projects_list', {
                projectsList: projects
            })
        })
        .catch(error => {
            console.log(error);
        })
}