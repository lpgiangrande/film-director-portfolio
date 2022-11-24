//const { S3Client, PutObjectAclCommand } = require("@aws-sdk/client-s3");
const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const thumbnailsSchema = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject');

require('dotenv').config();
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




/* ADMIN ROUTES */


// GET

// Log In page 
router.get('/', (req, res) => { // '/admin 
    res.render('auth');
})


// projects list page
router.get('/list', backofficeController.list);

// update thumbnail - update project
router.get('/updateThumbnail', (req, res) => {
  res.render('updateThumbnail');
})
router.get('/updateProject', (req, res) => {
  res.render('updateProject');
})


// Add thumbnail page (thumbnails image/video seen on Homepage)
router.get('/uploadThumbnail', (req, res) => {
    res.render('uploadThumbnail');
})

// Add project page 
router.get('/uploadProject', (req, res) => {
    thumbnailsSchema.find()
    .populate("project")
    .exec()
    .then(thumbnails => {
        res.render('uploadProject', {thumbnailsList: thumbnails})
      })
      .catch();
})

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






