const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const morgan = require("morgan");
const mongoose = require('mongoose');
const compression = require("compression");

app.use(compression())

// DB
const dotenv = require('dotenv').config();
const dbConnect = require('./dbConnect');

// for posted data to server via forms : 
      /* bodyParser was added back to Express in release 4.16.0, 
      That means you don't have to use it.
      */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// to log HTTP requests and errors
app.use(morgan("dev"));

// EJS 
app.set('view engine', 'ejs')

// GET PUBLIC FILES 
app.use('/public', express.static(path.join(__dirname, 'public')))

//Session - messages de validation
const session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use((req, res, next) =>{
  res.locals.message = req.session.message;
  delete req.session.message; // une fois le transfert de la req dans la res, on peut supprimer cette variable
  next();
})

// Routes
//const backoffice_routes2 = require('./routes/backoffice_routes_2.js')
const backoffice_routes = require('./routes/backoffice_routes.js')
const basicroutes = require('./routes/basicroutes.js')




app.use('/admin/', backoffice_routes)
app.use('/', basicroutes)

// PORT
const PORT = process.env.PORT || 4000 

app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
  })
  


// app listen loads the http module for you, creates a server and then starts it. no need for require http
// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim