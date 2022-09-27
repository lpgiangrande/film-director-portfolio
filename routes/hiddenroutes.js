const express = require("express");
const router = express.Router();
const ejs = require('ejs');
const mongoose = require("mongoose");
const thumbnailsSchema = require('../models/modelsThumbnails');
const destImg = 'public/thumbnails/';
const destVidg = 'public/videos-homepage/';
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


// Sign In page to backoffice
router.get('/admin', (req, res) => {
    res.render('auth');
})
// Add thumbnail
router.get('/admin/uploadThumbnail', (req, res) => {
    res.render('uploadThumbnail');
})
// Add project
router.get('/admin/uploadProject', (req, res) => {
    res.render('uploadProject');
})
// Add thumbnail
router.get('/admin/logoff', (req, res) => {
    res.render('logoff');
})

//router.post('')


//routeur.post("/livres", upload.single("image"), livreController.addBook);
router.post('/admin/uploadThumbnail', 
    upload.fields([{
        name: 'img_thumbnail', maxCount: 1
    }, {
        name: 'vid_thumbnail', maxCount: 1
    }
]),(req, res) => {
    const thumbnail = new thumbnailsSchema({
        _id: new mongoose.Types.ObjectId(),
        title : req.body.title_thumbnail,
        category : req.body.category,
        imgSrc : req.files.img_thumbnail[0].path,
        videoSrc : req.files.vid_thumbnail[0].path
    });
    thumbnail.save()
    .then(result => {
        console.log(result);
        res.redirect('/admin');
    })
    .catch(error => {
        console.log(error);
    })
})

module.exports = router;