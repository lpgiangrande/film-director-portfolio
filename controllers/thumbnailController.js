import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';

/**
 * addThumbnail 
 */

export const addThumbnail = async (req, res) => {
    try {
      const newThumbnail = new Thumbnail({
        _id: new mongoose.Types.ObjectId(),
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
        const thumbnail = await Thumbnail.findById(id).exec();

        res.render('updateThumbnail', {thumbnail: thumbnail});
    } catch (error) {
        console.log(error);
    }
};

// Submit the updated thumbnail 
export const handleThumbnailUpdate = async (req, res) => {
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