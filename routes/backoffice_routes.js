/**
 * This file contains the routes for the admin panel
 */
const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const Thumbnail = require('../models/Thumbnails');
const { ensureAuthenticated } = require('../config/auth');


router.get('/list', ensureAuthenticated, backofficeController.list);
router.get('/uploadThumbnail', ensureAuthenticated, (req, res) => {
  res.render('uploadThumbnail');
})


router.get('/uploadProject', ensureAuthenticated, (req, res) => {
  Thumbnail.find()
  .populate("project")
  .exec()
  .then(thumbnails => {
      res.render('uploadProject', {thumbnailsList: thumbnails})
    })
    .catch();
})

router.get('/updateAbout', ensureAuthenticated, (req, res) => {
  res.render('updateAbout');
})

router.get('/logoff', function (req, res, next) {
  req.logout(function(err){
    if(err) {
      return next(err);
    }
  req.flash('success_msg', "You are logged out");
  res.redirect('/login'); 
  });
});

// Update 
router.get('/updateThumbnail/:id', ensureAuthenticated, backofficeController.updateThumbnail);
router.get('/updateProject/:id', ensureAuthenticated, backofficeController.updateProject);

router.post('/thumbnailUpdated', ensureAuthenticated, backofficeController.handleThumbnailUpdate);
router.post('/projectUpdated', ensureAuthenticated, backofficeController.handleProjectUpdate);

// Delete
//router.get('/deleteThumbnail/:id', ensureAuthenticated, backofficeController.deleteThumbnail);


router.post('/uploadThumbnail', backofficeController.addThumbnail);
/*upload.fields(
  [
    { name: 'img_thumbnail', maxCount: 1}, 
    { name: 'vid_thumbnail', maxCount: 1}
  ]
),*/ 

router.post('/uploadProject', backofficeController.addProject);     



module.exports = router;


/**
 * // SIMPLE MULTER CONFIG
 */

//require('dotenv').config();
//const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//        if(file.mimetype === 'image/jpeg') {
//         cb(null, 'public/thumbnails_imgs/')
//       } else if (file.mimetype === 'video/mp4') {
//         cb(null, 'public/thumbnails_vids/')
//       } else {
//         console.log(file.mimetype)
//         cb({ error: 'Mime type not supported' })
//       }
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     },
//   })

// const upload = multer({ storage: storage })