const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require("morgan");

// DB
const mongoose = require('mongoose');
const dbConnect = require('./dbConnect');
  
// body parser pour traiter les URL et infos postées (form)
app.use(bodyParser.urlencoded({extended:true}));
// parse application/json
app.use(bodyParser.json())

// Routes
const basicroutes = require('./routes/basicroutes.js')
const hiddenroutes = require('./routes/hiddenroutes.js')

// app.use(express.json());

app.use(morgan("dev"));

/* EJS */
app.set('view engine', 'ejs')

/* GET PUBLIC FILES */
app.use('/public', express.static(path.join(__dirname, 'public')))

/* PORT */
const PORT = process.env.PORT || 4000 // FOR DEV. IN PROD ?


/* ROUTES */
app.use('/', hiddenroutes)
app.use('/', basicroutes)



/*app.listen(4000, function(){
    console.log('server is running')
})*/
app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
  })



// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim