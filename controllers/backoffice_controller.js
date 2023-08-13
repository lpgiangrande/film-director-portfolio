/**
 * This file contains @private functions for the admin panel.:
 *
 *  - addProject: Adds a new project (a new web page)
 *  - addThumbnail: Adds a new Project's thumbnail for the homepage
 *  - list: Renders a list of projects and thumbnails in a table
 *  - updateThumbnail: Handles the update of a thumbnail.
 *  - updateProject: Handles the update of a project.
 *  - handleThumbnailUpdate: Submits the updated thumbnail.
 *  - handleProjectUpdate: Submits the updated project.
 *  - updateBio
 *  - handleBioUpdate
 */

const mongoose = require("mongoose");
const Thumbnail = require('../models/Thumbnails');
const Project = require('../models/Project');
const Biography = require('../models/Biography');
// const biography = req.session.biography;
require('../config/passport') 


/**
 * Adds a new project.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 *
 * @description
 * This function handles the creation of a new project (a web page) based on the data provided in the request body.
 * The request body should contain informations such as the project title, images and videos links, paragraphs of texts...
 * Upon successful creation of the project, the function redirects the user to the updated list of projects.
 * 
 * @const {Array<string>} array_vids 
 * Array of trimmed video links obtained from the request body.
 * 
 * @const {Array<string>} gallery
 * Array of trimmed images links obtained from the request body
 * 
 * Project object representing a new project (new web page) linked to a thumbnail
 * @const {newProject} Project
 * @properties ... id, thumbnail, title, ... gallery ...
 */
exports.addProject = async (req, res) => {
    try {
      const array_vids = req.body.array_vids.split(',').map((vid) => vid.trim());
      const gallery = req.body.gallery.split(',').map((gallery_img) => gallery_img.trim());
  
      const newProject = new Project({
        _id: new mongoose.Types.ObjectId(),
        thumbnail: req.body.linkedThumbnail,
        project_title: req.body.project_title,
        director: req.body.director,
        other_contributors: req.body.other_contributors,
        productor: req.body.productor,
        array_vids: array_vids, // ARRAY
        video2_description: req.body.video2_description,
        video3_description: req.body.video3_description,
        video4_description: req.body.video4_description,
        video5_description: req.body.video5_description,
        video6_description: req.body.video6_description,
        video7_description: req.body.video7_description,
        gallery: gallery, // ARRAY
        gallery_row_1_description: req.body.description_1,
        gallery_row_2_description: req.body.description_2,
        gallery_row_3_description: req.body.description_3,
        gallery_row_4_description: req.body.description_4,
      });
  
      const result = await newProject.save();
      //console.log(result);
      res.redirect(301, '/admin/list');

    } catch (error) {
        console.log(error);
    }
  };
  
/**
 * addThumbnail 
 */
exports.addThumbnail = async (req, res) => {
    try {
      const newThumbnail = new Thumbnail({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title_thumbnail,
        category: req.body.category,
        imgSrc: req.body.img_thumbnail, //req.files.img_thumbnail[0].path,
        videoSrc: req.body.vid_thumbnail, //req.files.vid_thumbnail[0].path,
        releaseDate: req.body.release_date,
      });
  
      const result = await newThumbnail.save();
      console.log("result = ", result);
      res.redirect(301, '/admin/uploadProject');
      // res.redirect(301, '/'); --> see result/homepage
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error' });
    }
  };

/**
 * GET controllers
 */
  
// /admin/list : Render all projects into a table on admin homepage
exports.list = async (req, res) => {

    try {
      const projects = await Project.find({});
      const thumbnails = await Thumbnail.find({});
      // const biography = await Biography.findOne();
  
      res.render('list', {
        // biography: biography,
        projectsList: projects,
        thumbnailsList: thumbnails,
        username: req.user.username,
        biography: res.locals.biography
      });
    } catch (error) {
        console.log(error);
    }
  }; 
// /admin/uploadThumbnail : Thumbnail upload form
exports.uploadThumbnail = (req, res) => {
  res.render('uploadThumbnail');
}

// /admin/uploadProject : Project upload form linked to a home page thumbnail 
exports.uploadProject = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find().populate("project").exec();
    res.render('uploadProject', {thumbnailsList: thumbnails});
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite lors de la récupération des miniatures.");
  }
}

// Retrieve Thumbnail by id in order to update it in handleThumbnailUpdate()
exports.updateThumbnail = async (req, res) => {
    try {
        const id = req.params.id;
        const thumbnail = await Thumbnail.findById(id).exec();

        res.render('updateThumbnail', {thumbnail: thumbnail});

    } catch (error) {
        console.log(error);
    }
};


// Retrieve Project by id in order to update it in handleProjectUpdate()
exports.updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        await Thumbnail.find().exec();
        const project = await Project.findById(projectId).populate("thumbnail").exec();

        res.render("updateProject", { project: project });

    } catch (error) {
        console.log(error);
    }
};

// /admin/updateBiography : form for updating the biography (view)
exports.updateBiography = (req, res) => {
  Biography.findOne({}).exec((err, biography) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Biography:', biography);
    res.render('updateAbout', { biography: biography });
  });
};



/**
 *  POST REQUESTS
 */

// Submit the updated thumbnail 
exports.handleThumbnailUpdate = async (req, res) => {
    try {
      const thumbnailUpdate = {
        title: req.body.title_thumbnail,
        category: req.body.category,
        imgSrc: req.body.img_thumbnail,
        videoSrc: req.body.vid_thumbnail
      };
  
      await Thumbnail.updateOne({ _id: req.body.identifiant }, thumbnailUpdate).exec();
      res.redirect(301, '/admin/list');

    } catch (error) {
        console.log(error);
    }
  };
  
// Submit the updated Project
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


// Submit updated biography
exports.handleBiographyUpdate = async (req, res, next) => {
  try {
    const { pic, text, email } = req.body;

    const biography = await Biography.findOne();
    if (!biography) {
      // Handle case when no biography entry exists
      return res.status(404).send('Biography entry not found');
    }

    biography.pic = pic;
    biography.text = text;
    biography.email = email;

    await biography.save();

    req.flash('success_msg', 'Biography updated successfully');
    res.redirect('/admin/list');
  } catch (error) {
    next(error);
  }
};


// Log out admin panel
exports.logoff = (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      next(err); // Passes the error to the next error-handling middleware or default error handler
    } else {
      req.flash('success_msg', 'You are logged out');
      res.redirect('/login');
    }
  });
};





