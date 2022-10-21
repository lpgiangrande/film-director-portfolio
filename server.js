const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
//const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require('mongoose');

// DB
const dotenv = require('dotenv').config();
const dbConnect = require('./dbConnect');

// for posted infos to server via forms, ... 
      /* bodyParser was added back to Express in release 4.16.0, 
      That means you don't have to use bodyParser.
      */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to log HTTP requests and errors
app.use(morgan("dev"));

// EJS
app.set('view engine', 'ejs')

// GET PUBLIC FILES 
app.use('/public', express.static(path.join(__dirname, 'public')))


// Routes
const basicroutes = require('./routes/basicroutes.js')
const backoffice_routes = require('./routes/backoffice_routes.js')
const backoffice_routes2 = require('./routes/backoffice_routes_2.js')


app.use('/admin/', backoffice_routes2)
app.use('/admin', backoffice_routes)
app.use('/', basicroutes)

// PORT
const PORT = process.env.PORT || 4000 // FOR DEV. IN PROD ?

/*app.listen(4000, function(){
    console.log('server is running')
})*/
app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
  })
// app listen loads the http module for you, creates a server and then starts it. no need for require http


// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim