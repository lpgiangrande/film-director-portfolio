const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Thumbnail = require('../models/Thumbnails');
const projectSchema = require('../models/Project');

const bcrypt = require('bcryptjs');
const User = require('../models/User');



exports.homePage = (req, res) => {
    
Thumbnail.find()
    .sort({"releaseDate": -1})
    .exec(function(err, thumbnails){
        res.render('index', { thumbnailsList: thumbnails })}
    )
}
   /* Thumbnail.find({}, function(err, thumbnails){
        res.render('index', { thumbnailsList: thumbnails })
    })
};*/


// Order thumbnails by category for the Animation page
exports.animationPage = (req, res) => {
    const query = Thumbnail.find({ 'category': 'animation' })
    query.exec(function(err, thumbnails){
        res.render('animation', {
            thumbnailsList: thumbnails
        })
    })     
};

// Order thumbnails by category for the Liveaction page
exports.liveActionPage = (req, res) => {
    const query = Thumbnail.find({ 'category': 'liveaction' })
    query.exec(function(err, thumbnails){
        res.render('liveaction', {
            thumbnailsList: thumbnails
        })
    })      
};

/* 
From thumbnail clic to project details page 
--> If img gallery nb = odd, render template 1
--> If img gallery nb = even, render template 2
*/
exports.seeFullProject = (req, res) => {

    //req.params.id = id du thumbnail
    projectSchema.findOne({ "thumbnail": req.params.id })
        //.populate("thumbnail")
        .exec()
        .then(project => {

            ( project.gallery.length % 2 === 0 ) ? 
                res.render('project_v2', { project : project})
                : res.render('project', { project : project});
            
            console.log( "nb d'images : ", project.gallery.length);
            
            //console.log("id du projet : " + project._id);
        })
        .catch(error => {
            console.log(error)
        });
}

exports.aboutPage = (req, res) => {
    res.render('about')
};

// --> to backoffice

exports.loginPage = (req, res) => {
    res.render('login') // router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
}

exports.registerPage = (req, res) => {
    res.render('register') // router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
}


// Register handle - POST
exports.handleRegistration =  (req, res) => { 
    
    console.log("req body : ", req.body);
    //res.status(200).json({"data" : req.body});
    const { username, pwd, pwd2 } = req.body;
    let errors = [];
  
    // Check required fields
    if(!username || !pwd || !pwd2) {
      errors.push({msg: 'Fields should not be empty'})
    }
  
    // Check Pwd match
    if(pwd !== pwd2){
      errors.push({msg: 'Passwords do not match'})
    }
  
    // Check pwd length
    if(pwd.length < 6){
      errors.push(({msg: 'Password should be at least 6 characters'}))
    }
  
    if(errors.length > 0) {
      res.render('register', {
        errors, 
        username,
        pwd,
        pwd2
      })
    } else {
      //res.send('pass');
      User.findOne({ username: username})
        .then(user => {
            if(user){
                // User exists
                errors.push({ msg: 'already registered'})
                res.render('register', {
                    errors, 
                    username,
                    pwd,
                    pwd2
                });
            } else {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    username : username,
                    pwd : pwd
                });
               // console.log(newUser)
               // res.send('Hello user')

               // Hash pwd
               bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.pwd, salt, (err, hash) => {
                    if(err) throw err;
                    // Set pwd to hash
                    newUser.pwd = hash;
                    // Save user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered. You can log in');
                            res.redirect('/login')
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }
  }