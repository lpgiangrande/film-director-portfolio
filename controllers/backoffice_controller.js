const mongoose = require("mongoose");
const thumbnailsSchema = require('../models/Thumbnails');
const projectSchema = require('../models/Project');
require('../config/passport') // test

/**
 * addProject from admin | upload
 * @param {*} req  
 * @param {*} res 
 * Convert videos input content into an array or videos urls
 * Map over req.files to get array of images
 */


/* ONLY IF VIDS && IMG ARE UPLOADED FILES :


let vids = []; 

for(let i = 0; i < req.files.length; i++){ 

    vids[i] = req.files[i].path; 
    vids = vids.filter(vid => vid.endsWith('.mp4'))
} 

let  visuals = []; 

for(let j = 0; j < req.files.length; j++){ 

    visuals[j] = req.files[j].path;
    visuals = visuals.filter(visual => visual.endsWith('.jpg'))
    
}

*/

exports.addProject = (req, res) => {

    // vids array
    let array_vids = [];
    let contentFromInput = req.body.array_vids;
    let splitContent = contentFromInput.split(',');

    splitContent.forEach(function(vid){
        array_vids.push(vid.trim());
    });
    
    // imgs array - if file upload : 
    // let array_files = req.files;
    // let visuals = array_files.map(visual => visual.path);

    // imgs array - if upload aws img links : 
    let gallery = [];
    let contentFromInput2 = req.body.gallery;
    let splitContent2 = contentFromInput2.split(',');

    splitContent2.forEach(function(gallery_img){
        gallery.push(gallery_img.trim());
    });


    const project = new projectSchema({

        _id: new mongoose.Types.ObjectId(),

        thumbnail : req.body.linkedThumbnail,
        //category : req.body.category,
        project_title : req.body.project_title,
        director : req.body.director,
        other_contributors : req.body.other_contributors,
        productor : req.body.productor,

        // Videos
        array_vids : array_vids, 
        video2_description: req.body.video2_description, 
        video3_description: req.body.video3_description,
        video4_description: req.body.video4_description,
        video5_description: req.body.video5_description,
        video6_description: req.body.video6_description,
        video7_description: req.body.video7_description,

        //images
        gallery : gallery, // gallery_video : req.files.gallery_video;
        gallery_row_1_description : req.body.description_1,
        gallery_row_2_description : req.body.description_2,
        gallery_row_3_description : req.body.description_3,
        gallery_row_4_description : req.body.description_4

    })
    
    project.save()

    .then(result => {
        console.log(result);
        res.redirect(301, '/admin/list');

    })
    .catch(error => {
        console.log(error);
    })
}

/**
 * addThumbnail from admin 
 * @param {*} req 
 * @param {*} res 
 */

exports.addThumbnail = (req, res) => {

    const thumbnail = new thumbnailsSchema({

        _id: new mongoose.Types.ObjectId(),
        title : req.body.title_thumbnail,
        category : req.body.category,
        imgSrc : req.body.img_thumbnail, //req.files.img_thumbnail[0].path, 
        videoSrc : req.body.vid_thumbnail, //req.files.vid_thumbnail[0].path, 
        releaseDate : req.body.release_date

    })

    thumbnail.save()

        .then(result => {
            console.log("result = ",result);
            res.redirect(301, '/admin/uploadProject');
            // res.redirect(301, '/'); --> see result/homeapge
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({msg: 'Error'});
        })

}


/**
 * projectsList | render all thumbnails / projects into table
 * @param {*} req 
 * @param {*} res 
 */
exports.list = (req, res) => {
    projectSchema.find({}, function(err, projects){
        thumbnailsSchema.find({}, function(err,thumbnails) {
            res.render('list', {
                projectsList: projects,
                thumbnailsList: thumbnails,
                username: req.user.username
            })
        })
    })
    .catch(error => {
        console.log(error);
    })

}

// UPDATE thumbnail by id 
exports.updateThumbnail = (req, res) => {

    const id = req.params.id;

    thumbnailsSchema.findById(id)
    //.then(thumbnail => res.json(thumbnail))
    //.catch(err => res.status(400).json('The fuck is the Error: ' + err));
        .exec()
        .then(thumbnail => {
            res.render("updateThumbnail", {
                thumbnail: thumbnail
            })
        })
}

// UPDATE project by id
exports.updateProject = (req, res) => {

    const projectId = req.params.id;

    thumbnailsSchema.find()
    .exec()
    .then(projects => {
        projectSchema.findById(projectId)
        .populate("thumbnail")
        .exec()
        .then(project => {
            res.render("updateProject", {
                project: project
            })
        })
    })
}


exports.handleThumbnailUpdate = (req, res) => {

    const thumbnailUpdate = {
        title : req.body.title_thumbnail,
        category : req.body.category,
        imgSrc : req.body.img_thumbnail, 
        videoSrc : req.body.vid_thumbnail
    }
    thumbnailsSchema.updateOne({_id: req.body.identifiant}, thumbnailUpdate)
    .exec()
    .then(result => {
        console.log(result);
        res.redirect(301, '/admin/list');
    })
    .catch(error => {
        console.log(error);
    })
    
}

exports.handleProjectUpdate = (req, res) => {

    let array_vids = [];
    let contentFromInput = req.body.array_vids;
    let splitContent = contentFromInput.split(',');

    splitContent.forEach(function(vid){
        array_vids.push(vid.trim());
    });
  
    let gallery = [];
    let contentFromInput2 = req.body.gallery;
    let splitContent2 = contentFromInput2.split(',');

    splitContent2.forEach(function(gallery_img){
        gallery.push(gallery_img.trim());
    });

    const projectUpdate = {
        thumbnail : req.body.linkedThumbnail,
        project_title : req.body.project_title,
        director : req.body.director,
        other_contributors : req.body.other_contributors,
        productor : req.body.productor,

        array_vids : array_vids, 
        video2_description: req.body.video2_description, 
        video3_description: req.body.video3_description,
        video4_description: req.body.video4_description,
        video5_description: req.body.video5_description,
        video6_description: req.body.video6_description,
        video7_description: req.body.video7_description,

        gallery : gallery, 
        gallery_row_1_description : req.body.description_1,
        gallery_row_2_description : req.body.description_2,
        gallery_row_3_description : req.body.description_3,
        gallery_row_4_description : req.body.description_4
    }
    projectSchema.updateOne({_id: req.body.identifiant}, projectUpdate)
    .exec()
    .then(result => {
        console.log(result);
        res.redirect(301, '/admin/list');
    })
    .catch(error => {
        console.log(error);
    })
    
}


