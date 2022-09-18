const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const Thumbnail = require('./models/modelsThumbnails');
//const Project = require('./models/modelsProject')
const mongoose = require('mongoose');
const dbConnect = require('./dbConnect');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
//const router = require('./routes/basic.routes');
const basicroutes = require('./routes/basicroutes.js')

/* EJS */
app.set('view engine', 'ejs')

/* GET PUBLIC FILES */
app.use('/public', express.static(path.join(__dirname, 'public')))

/* PORT */
const PORT = process.env.PORT || 4000 // FOR DEV. IN PROD ?

// ?
app.use(bodyParser.urlencoded({extended:false}));
 

/* ROUTES */
app.use('/', basicroutes)



/* FORM UPLOAD */


app.get('/upload-project', (req, res) => {
    res.render('upload-project')
})

 
/*app.listen(4000, function(){
    console.log('server is running')
})*/
app.listen(PORT, () => { 
    console.log(`server is running on ${PORT}`)
  })



// src https://www.youtube.com/watch?v=yH593K9fYvE&ab_channel=MarinaKim