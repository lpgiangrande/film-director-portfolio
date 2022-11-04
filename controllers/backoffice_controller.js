const mongoose = require("mongoose");
const thumbnailsSchema = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject')


/**
 * addProject from admin | upload
 * @param {*} req  Iterate through req.files but on 2 differents fields before saving files path in mongodb | Create new instance of project | save it
 * @param {*} res 
 */

exports.addProject = (req, res) => {

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

    const project = new projectSchema({

        _id: new mongoose.Types.ObjectId(),
        thumbnail : req.body.linkedThumbnail,
        category : req.body.category,
        project_title : req.body.project_title,
        director : req.body.director,
        other_contributors : req.body.other_contributors,
        productor : req.body.productor,
        array_vids : vids, // voir remplacer par champs txt lien vimeo

        video_description: req.body.secondary_video_description,
        
        gallery : visuals,
        gallery_row_1_description : req.body.description_1,
        gallery_row_2_description : req.body.description_2,
        gallery_row_3_description : req.body.description_3,
        gallery_row_4_description : req.body.description_4     

    })
    project.save()

    .then(result => {
        console.log(result);
        console.log(req.body.thumbnail);
    })
    .catch(error => {
        console.log(error);
    })
}


/**
 * addThumbnail from admin | upload
 * @param {*} req 
 * @param {*} res 
 */

exports.addThumbnail = (req, res) => {
    
    const thumbnail = new thumbnailsSchema({

        _id: new mongoose.Types.ObjectId(),
        title : req.body.title_thumbnail,
        category : req.body.category,
        imgSrc : req.files.img_thumbnail[0].path,
        videoSrc : req.files.vid_thumbnail[0].path,
        releaseDate : req.body.release_date

    })
    thumbnail.save()

        .then(result => {
            console.log(result);
            res.redirect('/admin');
        })
        .catch(error => {
            console.log(error);
        })
}


/**
 * projectsList | render all projects into table
 * @param {*} req 
 * @param {*} res 
 */
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