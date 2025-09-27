import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';
import Project from '../models/Project.js';

// Add a new project
export const addProject = async (req, res) => {
  try {
    const array_vids = req.body.array_vids.split(',').map(v => v.trim());
    const gallery = req.body.gallery.split(',').map(img => img.trim());

    const newProject = new Project({
      thumbnail: req.body.linkedThumbnail,
      project_title: req.body.project_title,
      director: req.body.director,
      other_contributors: req.body.other_contributors,
      productor: req.body.productor,
      array_vids,
      video2_description: req.body.video2_description,
      video3_description: req.body.video3_description,
      video4_description: req.body.video4_description,
      video5_description: req.body.video5_description,
      video6_description: req.body.video6_description,
      video7_description: req.body.video7_description,
      gallery,
      gallery_row_1_description: req.body.description_1,
      gallery_row_2_description: req.body.description_2,
      gallery_row_3_description: req.body.description_3,
      gallery_row_4_description: req.body.description_4
    });

    await newProject.save();
    res.redirect(301, '/admin/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while adding project');
  }
};

// Render project upload form
export const uploadProject = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find().populate('project').exec();
    res.render('uploadProject', { thumbnailsList: thumbnails });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching thumbnails');
  }
};

// Retrieve project by ID for editing
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send('Invalid project ID');
    }

    const project = await Project.findById(projectId)
      .populate('thumbnail')
      .exec();

    if (!project) {
      return res.status(404).send('Project not found');
    }

    res.render('updateProject', {
      project,
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while fetching project');
  }
};

// Submit updated project
export const handleProjectUpdate = async (req, res) => {
  try {
    const projectId = req.body.identifier;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send('Invalid project ID');
    }

    const array_vids = req.body.array_vids.split(',').map(v => v.trim());
    const gallery = req.body.gallery.split(',').map(img => img.trim());

    const updateData = {
      thumbnail: req.body.linkedThumbnail,
      project_title: req.body.project_title,
      director: req.body.director,
      other_contributors: req.body.other_contributors,
      productor: req.body.productor,
      array_vids,
      video2_description: req.body.video2_description,
      video3_description: req.body.video3_description,
      video4_description: req.body.video4_description,
      video5_description: req.body.video5_description,
      video6_description: req.body.video6_description,
      video7_description: req.body.video7_description,
      gallery,
      gallery_row_1_description: req.body.description_1,
      gallery_row_2_description: req.body.description_2,
      gallery_row_3_description: req.body.description_3,
      gallery_row_4_description: req.body.description_4
    };

    const result = await Project.updateOne({ _id: projectId }, updateData).exec();

    if (result.modifiedCount === 0) {
      return res.status(404).send('Project not found or no changes detected');
    }

    res.redirect(301, '/admin/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while updating project');
  }
};
