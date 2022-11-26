const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const thumbnailsSchema = require('../models/Thumbnails');
const User = require('../models/User');
const projectSchema = require('../models/Project');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');


/* ADMIN ROUTES */

// projects list page
router.get('/list', ensureAuthenticated, backofficeController.list);

// update thumbnail - update project
router.get('/updateThumbnail', ensureAuthenticated, (req, res) => {
  res.render('updateThumbnail');
})
router.get('/updateProject', ensureAuthenticated, (req, res) => {
  res.render('updateProject');
})

// Add thumbnail page (thumbnails image/video seen on Homepage)
router.get('/uploadThumbnail', ensureAuthenticated, (req, res) => {
  res.render('uploadThumbnail');
})

// Add project page 
router.get('/uploadProject', ensureAuthenticated, (req, res) => {
  thumbnailsSchema.find()
  .populate("project")
  .exec()
  .then(thumbnails => {
      res.render('uploadProject', {thumbnailsList: thumbnails})
    })
    .catch();
})

/**
 * auth | log out
 */
router.get('/logoff', function (req, res, next) {
  req.logout(function(err){
    if(err) {
      return next(err);
    }
  req.flash('success_msg', "You are logged out");
  res.redirect('/login');
});
});


// POST

// Upload files paths to the database (homepage - thumbnails) 
router.post('/uploadThumbnail', 
/*upload.fields(
  [
    { name: 'img_thumbnail', maxCount: 1}, 
    { name: 'vid_thumbnail', maxCount: 1}
  ]
),*/ backofficeController.addThumbnail);

// POST route for uploading text and files paths to the database for the Project page 
router.post('/uploadProject', backofficeController.addProject);     


module.exports = router;



//require('dotenv').config();
//const multer = require('multer');

/* SIMPLE MULTER CONFIG

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      /* if(file.mimetype === 'image/jpeg') {
        cb(null, 'public/thumbnails_imgs/')*/
      /*} else*/ /* if (file.mimetype === 'video/mp4') {
        cb(null, 'public/thumbnails_vids/')
      } else {
        console.log(file.mimetype)
        cb({ error: 'Mime type not supported' })
      }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
  })

const upload = multer({ storage: storage })*/











