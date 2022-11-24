/* SECOND FILE FOR BACK OFFICE'S ROUTES 
BECAUSE OF A DIFFERENT MULTER CONFIGURATION (destination folder) */


const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const thumbnailsSchema = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject');


/* ENLEVER CONFIG MULTER SI TOUT SUR AWS 

/* MULTER CONFIG - 2 */
const multer  = require('multer');

// CREER UN DOSSIER POUR CHAQUE PROJET UPLOADé serait mieux

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'image/jpeg') {
        cb(null, 'public/projects_images/')
      } /* else if (file.mimetype === 'video/mp4'){
        cb(null, 'public/projects_videos/') 
      } */ else {
        console.log(file.mimetype)
        cb({ error: 'Mime type not supported' })
      }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
  })

const upload = multer({ storage: storage })


// POST route for uploading text and files paths to the database for the Project page 
router.post('/uploadProject', upload.any(), backofficeController.addProject);     


module.exports = router;


