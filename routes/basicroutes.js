/**
 * GET routes for the user
 * GET route for the client to login
 * GET / POST route once used to create 2 CMS users (me and client, limit of 2 accounts)
 */

const express = require("express");
const router = express.Router();
const mainController = require('../controllers/main_controller');
const backofficeController = require('../controllers/backoffice_controller');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User')
const { forwardAuthenticated } = require('../config/auth');


/**
 * POST route for user login.
 *
 * @function
 * @name login
 * @memberof router
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 * @returns {undefined}
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/list',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});


router.post('/register', mainController.handleRegistration);

router.get('/', mainController.homePage);
router.get('/animation/', mainController.animationPage);
router.get('/liveaction/', mainController.liveActionPage);
router.get('/about', mainController.aboutPage);
router.get('/register', forwardAuthenticated, mainController.registerPage);
router.get('/login', forwardAuthenticated, mainController.loginPage);
router.get('/:id', mainController.seeFullProject);


module.exports = router;