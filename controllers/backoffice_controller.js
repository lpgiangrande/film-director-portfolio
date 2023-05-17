const mongoose = require("mongoose");
const Thumbnail = require('../models/Thumbnails');
const Project = require('../models/Project');
require('../config/passport') // test

/**
 * addProject from admin | upload 
 * Each "project" is a new web page with project id, title, images & video links...
 * & a thumbnail added on the homepage to clic on it 
 * @param {*} req  
 * @param {*} res 
 * 
 * Array of trimmed video links obtained from the request body.
 * @const {Array<string>} array_vids 
 * 
 * Array of trimmed images links obtained from the request body
 * @const {Array<string>} gallery
 * 
 * Project object representing a new project.
 * @const {newProject} project
 * @properties ... id, thumbnail, title, ... gallery ...
 */

exports.addProject = (req, res) => {

    const array_vids = req.body.array_vids.split(',').map(vid => vid.trim());
    const gallery = req.body.gallery.split(',').map(gallery_img => gallery_img.trim());

    const newProject = new Project({
        _id: new mongoose.Types.ObjectId(),
        thumbnail : req.body.linkedThumbnail,
        project_title : req.body.project_title,
        director : req.body.director,
        other_contributors : req.body.other_contributors,
        productor : req.body.productor,
        array_vids : array_vids, // ARRAY
        video2_description: req.body.video2_description, 
        video3_description: req.body.video3_description,
        video4_description: req.body.video4_description,
        video5_description: req.body.video5_description,
        video6_description: req.body.video6_description,
        video7_description: req.body.video7_description,
        gallery : gallery, // ARRAY
        gallery_row_1_description : req.body.description_1,
        gallery_row_2_description : req.body.description_2,
        gallery_row_3_description : req.body.description_3,
        gallery_row_4_description : req.body.description_4
    });

    newProject
        .save()
        .then(result => {
            console.log(result);
            res.redirect(301, '/admin/list');
        })
        .catch(error => {
            console.log(error);
        });

};

/**
 * addThumbnail from admin - before adding a project page, add its thumbnail for the home page
 * @param {*} req 
 * @param {*} res 
 */

exports.addThumbnail = (req, res) => {

    const newThumbnail = new Thumbnail({
        _id: new mongoose.Types.ObjectId(),
        title : req.body.title_thumbnail,
        category : req.body.category,
        imgSrc : req.body.img_thumbnail, //req.files.img_thumbnail[0].path, 
        videoSrc : req.body.vid_thumbnail, //req.files.vid_thumbnail[0].path, 
        releaseDate : req.body.release_date
    });

    newThumbnail
        .save()
        .then(result => {
            console.log("result = ",result);
            res.redirect(301, '/admin/uploadProject');
            // res.redirect(301, '/'); --> see result/homeapge
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({msg: 'Error'});
        });
}


/**
 * projectsList | render all thumbnails / projects into table
 * @param {*} req 
 * @param {*} res 
 */
exports.list = async (req, res) => {

    try {
      const projects = await Project.find({});
      const thumbnails = await Thumbnail.find({});
  
      res.render('list', {
        projectsList: projects,
        thumbnailsList: thumbnails,
        username: req.user.username,
      });
    } catch (error) {
      console.log(error);
    }

  };
  

// UPDATE thumbnail by id
exports.updateThumbnail = async (req, res) => {

    try {
        const id = req.params.id;
        const thumbnail = await Thumbnail.findById(id).exec();

        res.render('updateThumbnail', {
            thumbnail: thumbnail
        });
    } catch (error) {
        console.log(error);
    }

};


// UPDATE project by id
exports.updateProject = async (req, res) => {

    try {
        const projectId = req.params.id;

        await Thumbnail.find().exec();
        const project = await Project.findById(projectId).populate("thumbnail").exec();

        res.render("updateProject", {
        project: project
        });
    } catch (error) {
        console.log(error);
    }

};
  

exports.handleThumbnailUpdate = async (req, res) => {

    try {
      const thumbnailUpdate = {
        title: req.body.title_thumbnail,
        category: req.body.category,
        imgSrc: req.body.img_thumbnail,
        videoSrc: req.body.vid_thumbnail
      };
  
      await Thumbnail.updateOne({ _id: req.body.identifiant }, thumbnailUpdate).exec();
  
      //console.log(result);
      res.redirect(301, '/admin/list');
    } catch (error) {
      console.log(error);
    }

  };
  

exports.handleProjectUpdate = async (req, res) => {

    try {
      const array_vids = req.body.array_vids.split(',').map(vid => vid.trim());
      const gallery = req.body.gallery.split(',').map(gallery_img => gallery_img.trim());
  
      const projectUpdate = {
        thumbnail: req.body.linkedThumbnail,
        project_title: req.body.project_title,
        director: req.body.director,
        other_contributors: req.body.other_contributors,
        productor: req.body.productor,
  
        array_vids: array_vids,
        video2_description: req.body.video2_description,
        video3_description: req.body.video3_description,
        video4_description: req.body.video4_description,
        video5_description: req.body.video5_description,
        video6_description: req.body.video6_description,
        video7_description: req.body.video7_description,
  
        gallery: gallery,
        gallery_row_1_description: req.body.description_1,
        gallery_row_2_description: req.body.description_2,
        gallery_row_3_description: req.body.description_3,
        gallery_row_4_description: req.body.description_4
      };
  
      const result = await Project.updateOne({ _id: req.body.identifiant }, projectUpdate).exec();
      //console.log(result);
      res.redirect(301, '/admin/list');
    } catch (error) {
      console.log(error);
    }
};
  
  


