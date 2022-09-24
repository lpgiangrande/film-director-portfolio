const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require("morgan");

//const Project = require('./models/modelsProject')

// DB
const mongoose = require('mongoose');
const dbConnect = require('./dbConnect');
// Uploads
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'image/jpeg') {
        cb(null, 'public/thumbnails')
      } else if (file.mimetype === 'video/mp4') {
        cb(null, 'public/videos-homepage')
      } else {
        console.log(file.mimetype)
        cb({ error: 'Mime type not supported' })
      }
    }
  })
  
const upload = multer({ storage: storage })

// Routes
const basicroutes = require('./routes/basicroutes.js')
const hiddenroutes = require('./routes/hiddenroutes.js')


app.use(morgan("dev"));

/* EJS */
app.set('view engine', 'ejs')

/* GET PUBLIC FILES */
app.use('/public', express.static(path.join(__dirname, 'public')))

/* PORT */
const PORT = process.env.PORT || 4000 // FOR DEV. IN PROD ?

// ?
app.use(bodyParser.urlencoded({extended:false}));
 
// ? 
app.use(express.json());

/* ROUTES */
app.use('/', hiddenroutes)
app.use('/', basicroutes)



/* FORM UPLOAD */



 
/*app.listen(4000, function(){
    console.log('server is running')
})*/
app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
  })



// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim