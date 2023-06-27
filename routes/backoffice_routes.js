/**
 * This file contains the routes for the admin panel
 */
const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const { ensureAuthenticated } = require('../config/auth');


router.get('/updateAbout', ensureAuthenticated, backofficeController.updateBiography);
router.get('/list', ensureAuthenticated, backofficeController.list);
router.get('/uploadThumbnail', ensureAuthenticated, backofficeController.uploadThumbnail);
router.get('/uploadProject', ensureAuthenticated,  backofficeController.uploadProject);
router.get('/logoff', ensureAuthenticated, backofficeController.logoff);

// Update 
router.get('/updateThumbnail/:id', ensureAuthenticated, backofficeController.updateThumbnail);
router.get('/updateProject/:id', ensureAuthenticated, backofficeController.updateProject);

router.post('/thumbnailUpdated', ensureAuthenticated, backofficeController.handleThumbnailUpdate);
router.post('/projectUpdated', ensureAuthenticated, backofficeController.handleProjectUpdate);
// router.post('/updateAbout', ensureAuthenticated, backofficeController.handleBiographyUpdate);

// Delete
//router.get('/deleteThumbnail/:id', ensureAuthenticated, backofficeController.deleteThumbnail);

// Uploads
router.post('/uploadThumbnail', backofficeController.addThumbnail);
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




/*upload.fields(
  [
    { name: 'img_thumbnail', maxCount: 1}, 
    { name: 'vid_thumbnail', maxCount: 1}
  ]
),*/ 