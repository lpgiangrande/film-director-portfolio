import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';
import Project from '../models/Project.js';
import { deleteUnusedFiles, thumbnailFiles, projectFiles, flashS3Result } from '../utils/s3Cleanup.js';

/**
 * addThumbnail 
 */

export const addThumbnail = async (req, res) => {
  try {
    const newThumbnail = new Thumbnail({
      //_id: new mongoose.Types.ObjectId(),
      title: req.body.title_thumbnail,
      category: req.body.category,
      imgSrc: req.body.img_thumbnail,
      videoSrc: req.body.vid_thumbnail,
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


// /admin/uploadThumbnail : Thumbnail upload form
export const uploadThumbnail = (req, res) => {
  res.render('uploadThumbnail');
}

// Retrieve Thumbnail by id in order to update it in handleThumbnailUpdate()
export const updateThumbnail = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('invalid ID');
    }

    const thumbnail = await Thumbnail.findById(id).exec();
    if (!thumbnail) return res.status(404).send('Thumbnail not find');

    res.render('updateThumbnail', { thumbnail: thumbnail });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
};

// Submit the updated thumbnail 
export const handleThumbnailUpdate = async (req, res) => {
  try {

    const id = req.body.identifier;

    // Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid ID');
    }

    const updateData = {
      title: req.body.title_thumbnail,
      category: req.body.category,
      imgSrc: req.body.img_thumbnail,
      videoSrc: req.body.vid_thumbnail
    };

    const result = await Thumbnail.updateOne({ _id: id }, updateData).exec();

    if (result.modifiedCount === 0) {
      return res.status(404).send('Thumbnail not found or no changes detected');
    }

    res.redirect(301, '/admin/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
// Deletes a whole project: the thumbnail, the project page linked to it (only reachable through
// its thumbnail) and their files on S3. Also used by the "Delete" of the projects table.
export const removeProjectEntirely = async (req, thumbnailId) => {
  const thumbnail = await Thumbnail.findByIdAndDelete(thumbnailId).exec();
  const projects = await Project.find({ thumbnail: thumbnailId }).exec();
  await Project.deleteMany({ thumbnail: thumbnailId }).exec();

  const files = [
    ...(thumbnail ? thumbnailFiles(thumbnail) : []),
    ...projects.flatMap(projectFiles),
  ];
  const s3 = flashS3Result(req, await deleteUnusedFiles(files));
  const title = projects.length ? projects[0].project_title : thumbnail && thumbnail.title;
  return { found: !!(thumbnail || projects.length), message: `Projet « ${title} » supprimé du site.${s3}` };
};

export const deleteThumbnail = async (req, res) => {
  try {
    const thumbnailId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(thumbnailId)) {
      return res.status(400).send('Invalid thumbnail ID');
    }

    const { found, message } = await removeProjectEntirely(req, thumbnailId);

    if (!found) {
      return res.status(404).send('Thumbnail not found');
    }

    req.flash('success_msg', message);
    res.redirect('/admin/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while deleting thumbnail');
  }
};
