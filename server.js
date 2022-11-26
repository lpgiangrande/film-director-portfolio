// serveur.js

/**
 * Required External Modules
 */

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const morgan = require("morgan");
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors')
require("dotenv").config();

const app = express();

/**
 * Passport config
 */
 require('./config/passport')(passport);

/**
 * DB
 */
const dbConnect = require('./dbConnect');

/**
 * APP CONFIGURATION 
 */

// for posted data to server via forms 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

//to log HTTP requests and errors
app.use(morgan("dev"));

// EJS
app.set('view engine', 'ejs')

// GET PUBLIC FILES
app.use('/public', express.static(path.join(__dirname, 'public')))



/**
 * Session Configuration 
 */
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


/**
 * Routes
 */
//const backoffice_routes2 = require('./routes/backoffice_routes_2.js')
const backoffice_routes = require('./routes/backoffice_routes.js')
const basicroutes = require('./routes/basicroutes.js')

// ROUTES
//app.use('/admin/', backoffice_routes)
app.use('/admin', backoffice_routes)
app.use('/', basicroutes)



// PORT
const PORT = process.env.PORT || 4000 

app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
})
  


// app listen loads the http module for you, creates a server and then starts it. no need for require http
// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim

// auth : https://auth0.com/blog/create-a-simple-and-secure-node-express-app/