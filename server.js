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
import cacheControl from 'cache-control';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto'; 

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Generate secret key
const secretKey = crypto.randomBytes(32).toString('hex');

const app = express();

// Set X-Frame-Options header middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Passport config
import { configurePassport } from './config/passport.js';
configurePassport(passport);

// Mongodb connect
import dbConnect from './db/dbConnect.js';

/**
 * APP CONFIGURATION 
 */

// for posted data to server via forms 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to log HTTP requests and errors
app.use(morgan("dev"));

// EJS
app.set('view engine', 'ejs');

// Serve static files from the root route ("/")
app.use('/', express.static(path.join(__dirname, 'public')));

// Helmet (helps secure your Express apps by setting various HTTP headers)
app.use(helmet.noSniff());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["https://ka-f.fontawesome.com"],
      frameSrc: ["'self'", "https://player.vimeo.com", "https://www.youtube.com"],
      scriptSrc: [
        "'self'",
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
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
      imgSrc: ["'self'", "https://site-regis.s3.eu-west-3.amazonaws.com",  "https://i.vimeocdn.com"],
      mediaSrc: ["'self'", "https://site-regis.s3.eu-west-3.amazonaws.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrcAttr: ["'unsafe-inline'"],
    },
  })
);

// Enable Strict-Transport-Security header
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// Session Configuration 
app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true, 
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Cache-control
app.use(cacheControl({
  maxAge: 86400 
}));

// Protect form
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts from this IP, please try again in 15 minutes",
});

/**
 * ROUTES
 */

// Import routes
import backofficeRoutes from './routes/backoffice_routes.js';
import basicRoutes from './routes/basicroutes.js';

// Use routes
app.use('/admin', backofficeRoutes);
app.use('/', basicRoutes);

/**
 * SERVER CONFIGURATION
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

// Exporting variables
export { app, limiter };
