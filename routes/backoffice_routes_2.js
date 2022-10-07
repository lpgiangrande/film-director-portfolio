/* SECOND FILE FOR BACK OFFICE'S ROUTES 
BECAUSE OF A DIFFERENT MULTER CONFIGURATION (destination folder) */

const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const thumbnailsSchema = require('../models/modelsThumbnails');

// Multer - Uploads
const multer  = require('multer');

// CREER UN DOSSIER POUR CHAQUE PROJER DANS /UPLOADS?
/*

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4') {
        cb(null, 'public/projects_uploads/')
      } else {
        console.log(file.mimetype)
        cb({ error: 'Mime type not supported' })
      }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
  })

  const upload = multer({ storage: storage })

  */

// POST route for uploading data to the database for the Project page
/*router.post('/admin/uploadProject', 
    upload.fields([{
        name: 'img_thumbnail', maxCount: 1
    }, {
        name: 'vid_thumbnail', maxCount: 1
    }
]), backofficeController.addProject);*/

module.exports = router;