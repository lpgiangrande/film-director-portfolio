/**
 * REQUIRED EXTERNAL MODULES
 */

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const morgan = require("morgan");
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cacheControl = require('cache-control');
//const cors = require('cors')
//const helmet = require('helmet');
require("dotenv").config();
const rateLimit = require('express-rate-limit');
const app = express();



//Passport config
require('./config/passport')(passport);

// Mongodb connect
const dbConnect = require('./dbConnect');

/**
 * APP CONFIGURATION 
 */

// for posted data to server via forms 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//to log HTTP requests and errors
app.use(morgan("dev"));

// EJS
app.set('view engine', 'ejs')

// GET PUBLIC FILES
app.use('/public', express.static(path.join(__dirname, 'public')))

//app.use(cors())

// Helmet (helps secure your Express apps by setting various HTTP headers)
// -> doc : https://helmetjs.github.io/
//app.use(helmet());
//app.disable('x-powered-by');

// Session Configuration 
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash()); // req.flash

// Global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Cache-control
app.use(cacheControl({
  maxAge: 86400 // durée de mise en cache en secondes (ici 24 heures)
}));


// Protect form
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, 
	standardHeaders: true, 
	legacyHeaders: false, 
  message: "Too many login attempts from this IP, please try again in 15 minutes",
})

app.use('/login', limiter);
module.exports = { limiter };


/**
 * ROUTES
 */

// Import routes
const backoffice_routes = require('./routes/backoffice_routes.js')
const basicroutes = require('./routes/basicroutes.js')

// Use routes
app.use('/admin', backoffice_routes)
app.use('/', basicroutes)


/**
 * SERVER CONFIGURATION
 */
const PORT = process.env.PORT || 3000 

app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
})
  


// app listen loads the http module for you, creates a server and then starts it. no need for require http
// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim

