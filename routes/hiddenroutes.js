const express = require("express");
const router = express.Router();
const ejs = require('ejs');


// Sign In page to backoffice
router.get('/admin', (req, res) => {
    res.render('auth');
})

module.exports = router;