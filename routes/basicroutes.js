/**
 * Public GET and POST Routes for the site
 * Handles user login, registration, and dynamic project pages.
 */

import { Router } from "express";
import mainController from '../controllers/main_controller.js';
import passport from 'passport';
import { forwardAuthenticated } from '../config/auth.js';
import rateLimit from 'express-rate-limit';
import he from 'he';
import path from 'path';

const router = Router();

// -------------------- Rate Limiter for Login -------------------- //
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts from this IP, please try again in 15 minutes",
});

// -------------------- Static Files -------------------- //
router.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/robots.txt'));
});

// -------------------- Public Pages -------------------- //
router.get('/', mainController.homePage);
router.get('/animation', mainController.animationPage);
router.get('/liveaction', mainController.liveActionPage);
router.get('/about', mainController.aboutPage);
// router.get('/privacypolicy', mainController.privacyPolicy);

// -------------------- Authentication -------------------- //
router.get('/register', forwardAuthenticated, mainController.registerPage);
router.post('/register', mainController.handleRegistration);

router.get('/login', forwardAuthenticated, mainController.loginPage);
router.post('/login', loginLimiter, (req, res, next) => {
  const username = he.encode(req.body.username.trim());
  const pwd = he.encode(req.body.pwd.trim());

  passport.authenticate('local', {
    successRedirect: '/admin/list',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// -------------------- Dynamic Project Pages -------------------- //
router.get('/:id', mainController.seeFullProject);

export default router;
