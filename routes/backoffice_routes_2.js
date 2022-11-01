/* SECOND FILE FOR BACK OFFICE'S ROUTES 
BECAUSE OF A DIFFERENT MULTER CONFIGURATION (destination folder) */

const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const thumbnailsSchema = require('../models/modelsThumbnails');
const projectSchema = require('../models/modelsProject');

// Multer - Uploads
const multer  = require('multer');


// CREER UN DOSSIER POUR CHAQUE PROJET UPLOADé serait mieux


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'image/jpeg') {
        cb(null, 'public/projects_images/')
      } else if (file.mimetype === 'video/mp4'){
        cb(null, 'public/projects_videos/')
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

// POST route for uploading data to the database for the Project page - Part 1
router.post('/uploadProject', 
  
    upload.any(), backofficeController.addProject);     
    
    
/* Pareil avec upload fields

router.post('/uploadProject', 
  upload.fields([
    { name: 'main_video', maxCount : 1},
    { name: 'secondary_video', maxCount : 1},
    { name: 'visuals_array', maxCount : 12} // 
  ]), backofficeController.addProjectPartOne)

  // array_files.map is not a function */

module.exports = router;






// POST route for uploading data to the database for the Project page - Part 2
//router.post('/uploadProjectPartTwo', upload.any(), backofficeController.addProjectPartTwo);
//router.post('/uploadProjectPartTwo', upload.array('visuals_array', 12), backofficeController.addProjectPartTwo);

/*router.post('/uploadProjectPartTwo', 
  
    //UPLOAD.FIELDS : 

    upload.fields([
      { name: 'visuals_array', maxCount: 12 }
    ]), backofficeController.addProjectPartTwo);   */
