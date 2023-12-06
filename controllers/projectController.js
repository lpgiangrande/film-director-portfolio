import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';  
import Project from '../models/Project.js';  

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

export const addProject = async (req, res) => {
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
        array_vids: array_vids, 
        video2_description: req.body.video2_description,
        video3_description: req.body.video3_description,
        video4_description: req.body.video4_description,
        video5_description: req.body.video5_description,
        video6_description: req.body.video6_description,
        video7_description: req.body.video7_description,
        gallery: gallery, // array of img links
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


// /admin/uploadProject : Project upload form linked to a home page thumbnail 
export const uploadProject = async (req, res) => {
    try {
      const thumbnails = await Thumbnail.find()
        .populate("project")
        .exec();
  
      res.render('uploadProject', {thumbnailsList: thumbnails});
      
    } catch (error) {
      console.error(error);
      res.status(500).send("Une erreur s'est produite lors de la récupération des miniatures.");
    }
  }


// Retrieve Project by id in order to update it in handleProjectUpdate()
export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        await Thumbnail.find().exec();
        const project = await Project.findById(projectId)
          .populate("thumbnail")
          .exec();

        res.render("updateProject", { project: project });

    } catch (error) {
        console.log(error);
    }
};


// Submit the updated Project
export const handleProjectUpdate = async (req, res) => {

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