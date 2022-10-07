const express = require("express");
const router = express.Router();
const backofficeController = require('../controllers/backoffice_controller');
const thumbnailsSchema = require('../models/modelsThumbnails');

// Multer - Uploads
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'image/jpeg') {
        cb(null, 'public/thumbnails/')
      } else if (file.mimetype === 'video/mp4') {
        cb(null, 'public/videos-homepage/')
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


// GET to Log In page 
router.get('/', (req, res) => { // '/admin 
    res.render('auth');
})
// GET to Add thumbnail page (thumbnails image/video seen on Homepage)
router.get('/uploadThumbnail', (req, res) => {
    res.render('uploadThumbnail');
})
// GET to Add project page (where the form to fill in the template for one projet is)
router.get('/uploadProject', (req, res) => {
    res.render('uploadProject');
})
// GET to the Log Out page
router.get('/logoff', (req, res) => {
    res.render('logoff');
})

/* POST route for uploading data to the database (homepage - thumbnails) */
router.post('/uploadThumbnail', 
    upload.fields([{
        name: 'img_thumbnail', maxCount: 1
    }, {
        name: 'vid_thumbnail', maxCount: 1
    }
]), backofficeController.addThumbnail);



module.exports = router;