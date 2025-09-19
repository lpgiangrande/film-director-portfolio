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

/**
 * CONFIGURATION
 */
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Generate secret key for sessions
const secretKey = process.env.SECRET_KEY || crypto.randomBytes(32).toString('hex');

/**
 * DATABASE CONNECTION
 */
mongoose.set('strictQuery', false);
import dbConnect from './db/dbConnect.js';
dbConnect();

/**
 * APP MIDDLEWARE
 */
// Compression GZIP
app.use(compression());

// X-Frame-Options header
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan('dev'));

// EJS view engine
app.set('view engine', 'ejs');

// Serve static files with cache
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true
}));


// Headers de cache spécifiques par type de fichier
app.use((req, res, next) => {
  if (req.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    res.set('Cache-Control', 'public, max-age=2592000');
  } else if (req.url.match(/\.(css|js)$/)) {
    res.set('Cache-Control', 'public, max-age=604800');
  }
  next();
});

// Helmet security headers
app.use(helmet.noSniff());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com", "https://cdn.jsdelivr.net"],
      frameSrc: ["'self'", "https://player.vimeo.com", "https://www.youtube.com"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Pour le script lazy loading
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
      fontSrc: ["'self'", "https://site-regis.s3.eu-west-3.amazonaws.com", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://site-regis.s3.eu-west-3.amazonaws.com", "https://i.vimeocdn.com"],
      mediaSrc: ["'self'", "https://site-regis.s3.eu-west-3.amazonaws.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrcAttr: ["'unsafe-inline'"],
    },
  })
);

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// Session configuration
app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global template variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Rate limiter for form protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts from this IP, please try again in 15 minutes",
});

// Route for robots.txt
// xxxx
/**
 * ROUTES
 */
import backofficeRoutes from './routes/backoffice_routes.js';
import basicRoutes from './routes/basicroutes.js';

app.use('/admin', backofficeRoutes);
app.use('/', basicRoutes);

/**
 * SERVER CONFIGURATION
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * EXPORTS
 */
export { app, limiter };