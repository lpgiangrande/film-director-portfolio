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

/**
 * POST route for user login.
 */

/**
 * Rate limiting configuration object for login requests.
 *
 * @typedef {Object} LimiterConfig
 * @property {number} windowMs - The duration in milliseconds for which the login attempts are counted.
 * @property {number} max - The maximum number of allowed login attempts within the specified duration.
 * @property {boolean} standardHeaders - Indicates whether to include standard rate limiting headers in the response.
 * @property {boolean} legacyHeaders - Indicates whether to include legacy rate limiting headers in the response.
 * @property {string} message - The message to be displayed when the rate limit is exceeded.
 */

const limiter = rateLimit({
  //windowMs: 1000, // Set a very short ban duration (1 second) for testing purposes
  windowMs: 15 * 60 * 1000, // ban 15 minutes 
  max: 3, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: "Too many login attempts from this IP, please try again in 15 minutes",
});

router.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/robots.txt'));
});


router.post('/login', limiter, (req, res, next) => {
  const username = req.body.username.trim();
  const pwd = req.body.pwd.trim();

  // Escape characters that may cause security issues
  const sanitizedUsername = he.encode(username);
  const sanitizedPwd = he.encode(pwd);
  // console.log('Sanitized username:', sanitizedUsername);
  // console.log('Sanitized pwd:', sanitizedPwd);

  passport.authenticate('local', {
    successRedirect: '/admin/list',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/register', mainController.handleRegistration);

router.get('/', mainController.homePage);
// router.get('/privacypolicy', mainController.privacyPolicy);
router.get('/animation/', mainController.animationPage);
router.get('/liveaction/', mainController.liveActionPage);
router.get('/about/', mainController.aboutPage);

router.get('/register', forwardAuthenticated, mainController.registerPage);
router.get('/login', forwardAuthenticated, mainController.loginPage);
router.get('/:id', mainController.seeFullProject);


module.exports = router;