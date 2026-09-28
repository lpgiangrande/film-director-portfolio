import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';
import Project from '../models/Project.js';
import parseBlocks from '../utils/projectBlocks.js';
import toVimeoEmbed from '../utils/vimeo.js';
import { deleteUnusedFiles, projectFiles, flashS3Result } from '../utils/s3Cleanup.js';
import { removeProjectEntirely } from './thumbnailController.js';

// Builds the project fields from the form (same form for creation and update: views/projectForm.ejs)
const projectDataFromForm = (body) => ({
  thumbnail: body.linkedThumbnail,
  project_title: body.project_title,
  director: body.director,
  other_contributors: body.other_contributors,
  productor: body.productor,
  main_video: toVimeoEmbed(body.main_video),
  blocks: parseBlocks(body.blocks),
});

// Thumbnails offered in the select: those not linked to a project yet (+ the current one when editing)
const availableThumbnails = async (currentProject) => {
  const usedIds = await Project.distinct('thumbnail', currentProject ? { _id: { $ne: currentProject._id } } : {});
  return Thumbnail.find({ _id: { $nin: usedIds } }).sort({ releaseDate: -1 }).exec();
};

const renderForm = async (req, res, project) => {
  res.render('projectForm', {
    project,
    thumbnailsList: await availableThumbnails(project),
    csrfToken: req.csrfToken()
  });
};

// Render project upload form
export const uploadProject = async (req, res) => {
  try {
    await renderForm(req, res, null);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching thumbnails');
  }
};

// Add a new project
export const addProject = async (req, res) => {
  try {
    const newProject = new Project(projectDataFromForm(req.body));
    await newProject.save();
    res.redirect('/admin/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while adding project');
  }
};

// Retrieve project by ID for editing
export const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send('Invalid project ID');
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
      return res.status(404).send('Project not found');
    }

    await renderForm(req, res, project);
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

    const project = await Project.findById(projectId).exec();

    if (!project) {
      return res.status(404).send('Project not found');
    }

    // save() rather than updateOne() so the schema validation and the slug middleware run
    project.set(projectDataFromForm(req.body));
    await project.save();

    res.redirect('/admin/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while updating project');
  }
};

// Delete a whole project (page + thumbnail + files): see removeProjectEntirely
export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send('Invalid project ID');
    }

    const project = await Project.findById(projectId).exec();

    if (!project) {
      return res.status(404).send('Project not found');
    }

    if (project.thumbnail) {
      const { message } = await removeProjectEntirely(req, project.thumbnail);
      req.flash('success_msg', message);
    } else {
      // Page without thumbnail (should not happen): delete the page alone
      await project.deleteOne();
      const s3 = flashS3Result(req, await deleteUnusedFiles(projectFiles(project)));
      req.flash('success_msg', `Projet « ${project.project_title} » supprimé du site.${s3}`);
    }

    res.redirect('/admin/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while deleting project');
  }
};
