const mongoose = require("mongoose");
const thumbnailsSchema = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject');

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
 * addThumbnail from admin | upload to s3 bucket
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
                thumbnailsList: thumbnails
            })
        })
    })
    .catch(error => {
        console.log(error);
    })

}



