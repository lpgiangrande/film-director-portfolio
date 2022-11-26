/* GET Routes for main pages (user) */

const express = require("express");
const router = express.Router();
const mainController = require('../controllers/main_controller');
const backofficeController = require('../controllers/backoffice_controller');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User')
//require('../config/passport') // test
//const { ensureAuthenticated } = require('../config/auth');
const { forwardAuthenticated } = require('../config/auth');


/**
 * auth | logged in
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/admin/list',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });


//router.get('/list', ensureAuthenticated, backofficeController.list);

router.post('/register', mainController.handleRegistration); // ok
//router.post('/login', mainController.loggedIn);
    
router.get('/', mainController.homePage); 
router.get('/animation/', mainController.animationPage);
router.get('/liveaction/', mainController.liveActionPage);
router.get('/about', mainController.aboutPage);
router.get('/register',  forwardAuthenticated, mainController.registerPage);
router.get('/login',  forwardAuthenticated, mainController.loginPage);
// Display project details when clic on a homepage/animation page/liveaction page thumbnail
router.get('/:id', mainController.seeFullProject);


module.exports = router;