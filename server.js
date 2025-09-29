'use strict';

/**
 * REQUIRED EXTERNAL MODULES
 */
import express from 'express';
import ejs from 'ejs';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import compression from 'compression';
import { fileURLToPath } from 'url';
import csrf from 'csurf';

/**
 * CONFIGURATION
 */
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// set CDN domain from environment
app.locals.cdnDomain = process.env.CDN_DOMAIN;
// Make cdnDomain available in all EJS templates
app.use((req, res, next) => {
  res.locals.cdnDomain = app.locals.cdnDomain;
  next();
});

// Generate a stable secret key for sessions (fallback if .env is not set)
const secretKey = process.env.SECRET_KEY;

/**
 * DATABASE CONNECTION
 */
mongoose.set('strictQuery', false);
import dbConnect from './db/dbConnect.js';
dbConnect();

/**
 * -------------------- APP MIDDLEWARE --------------------
 */

// Compress responses using GZIP
app.use(compression());

// X-Frame-Options header to prevent clickjacking
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Parse incoming JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan('dev'));

// EJS view engine
app.set('view engine', 'ejs');

// Serve static files with caching
app.use('/public', express.static(path.join(__dirname, 'public'), { etag: true }));
app.use('/js', express.static(path.join(__dirname, 'public/js'), { etag: true }));
app.use('/css', express.static(path.join(__dirname, 'public/css'), { etag: true }));

// Set long-term cache headers for (images, videos,) CSS, and JS
app.use((req, res, next) => {
  if (req.url.match(/\.(jpg|jpeg|png|gif|webp|mp4)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.match(/\.(css|js)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});

// -------------------- SECURITY HEADERS --------------------

// Basic Helmet headers
app.use(helmet.noSniff());

// Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com", "https://cdn.jsdelivr.net"],
      frameSrc: ["'self'", "https://player.vimeo.com", "https://www.youtube.com"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // for lazy loading scripts
        "https://site-regis.s3.eu-west-3.amazonaws.com",
        "https://cdn.jsdelivr.net",
        "https://kit.fontawesome.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://site-regis.s3.eu-west-3.amazonaws.com",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
        "https://ka-f.fontawesome.com",
      ],
      fontSrc: ["'self'", "https://site-regis.s3.eu-west-3.amazonaws.com", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
      imgSrc: [
        "'self'",
        "https://site-regis.s3.eu-west-3.amazonaws.com",
        "https://i.vimeocdn.com",
        "https://d1g8vhsh8s80a9.cloudfront.net"
      ],
      mediaSrc: ["'self'", "https://site-regis.s3.eu-west-3.amazonaws.com", "https://d1g8vhsh8s80a9.cloudfront.net"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrcAttr: ["'unsafe-inline'"],
    },
  })
);

// HSTS header for HTTPS
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// -------------------- SESSION CONFIGURATION --------------------
app.use(
  session({
    secret: secretKey,
    resave: false,           // don't save session if unmodified
    saveUninitialized: false,// don't create session until something stored
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      httpOnly: true,       // prevent access from client-side JS
      sameSite: 'strict',   // protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// -------------------- PASSPORT & FLASH --------------------
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global template variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// -------------------- CSRF PROTECTION --------------------
const csrfProtection = csrf({ cookie: false }); // token stored in session

// Apply CSRF only to sensitive POST routes
app.use(['/login', '/register', '/admin/*'], csrfProtection);

// Pass the CSRF token to all views
app.use((req, res, next) => {
  if (req.csrfToken) res.locals.csrfToken = req.csrfToken();
  next();
});

// -------------------- RATE LIMITER --------------------
// Limit login/register attempts to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,                    // max 3 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts from this IP, please try again in 15 minutes",
});

// -------------------- ROUTES --------------------
import backofficeRoutes from './routes/backoffice_routes.js';
import basicRoutes from './routes/basicroutes.js';

app.use('/admin', backofficeRoutes);
app.use('/', basicRoutes);

// -------------------- SERVER CONFIGURATION --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// -------------------- EXPORTS --------------------
export { app, limiter };
