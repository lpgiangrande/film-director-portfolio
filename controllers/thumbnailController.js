import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';

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