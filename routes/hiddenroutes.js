const express = require("express");
const router = express.Router();
const ejs = require('ejs');


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

// Page => Add book (Formulaire d'ajout de livre)
//routeur.post("/livres", upload.single("image"), livreController.addBook);

module.exports = router;