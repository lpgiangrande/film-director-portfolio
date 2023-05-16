/**
 * GET routes for the user
 * GET route for the client to login
 * GET / POST route once used to create 2 CMS users (me and client, limit of 2 accounts)
 */

const express = require("express");
const router = express.Router();
const mainController = require('../controllers/main_controller');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');
const rateLimit = require('express-rate-limit');
const he = require('he'); // prevent cross-site scripting (XSS) attacks by encoding the characters

// Protect auth form with rateLimit middleware
const limiter = rateLimit({
  //windowMs: 1000, // Set a very short ban duration (1 second) for testing purposes
  windowMs: 15 * 60 * 1000, // ban 15 minutes + fail2ban 
	max: 3, 
	standardHeaders: true, 
	legacyHeaders: false, 
  message: "Too many login attempts from this IP, please try again in 15 minutes",
})



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

router.post('/login', limiter, (req, res, next) => {
  const username = req.body.username.trim();
  const pwd = req.body.pwd.trim();

  // Escape characters that may cause security issues
  const sanitizedUsername = he.encode(username);
  const sanitizedPwd = he.encode(pwd);
  console.log('Sanitized username:', sanitizedUsername);
  console.log('Sanitized pwd:', sanitizedPwd);

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