const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const Thumbnail = require('../models/Thumbnails');
const projectSchema = require('../models/Project');
const User = require('../models/User');


// HOME PAGE -> display and order thumbnails from most recent to oldest 

exports.homePage = (req, res) => {
    
Thumbnail.find()
    .sort({"releaseDate": -1})
    .exec(function(err, thumbnails){
        res.render('index', { thumbnailsList: thumbnails })}
    )
}


// "ANIMATION" PAGE : -> Order thumbnails by said category & from most recent to oldest :

exports.animationPage = (req, res) => {
    const query = Thumbnail.find({ 'category': 'animation' }).sort({"releaseDate": -1})
    query.exec(function(err, thumbnails){
        res.render('animation', {
            thumbnailsList: thumbnails
        })
    })     
};

/*
exports.animationPage = (req, res) => {
    Thumbnail.find({ 'category': 'animation' }).sort({"releaseDate": -1}).exec(function(err, thumbnails){
        res.render('animation', {
            thumbnailsList: thumbnails
        })
    })     
};
*/


// "LIVE ACTION" PAGE : -> Order thumbnails by said category & from most recent to oldest :

exports.liveActionPage = (req, res) => {
    const query = Thumbnail.find({ 'category': 'liveaction' }).sort({"releaseDate": -1})
    query.exec(function(err, thumbnails){
        res.render('liveaction', {
            thumbnailsList: thumbnails
        })
    })      
};


// WHEN A THUMBNAIL IS SELECTED -> homepage/:id, liveaction/:id, animation/:id :

/*
--> If img gallery nb = odd, render template 1 
--> If img gallery nb = even, render template 2 

--> This allows for an alternative layout and ensures that no images are left isolated outside of the grid.
*/

exports.seeFullProject = (req, res) => {

    //req.params.id = id du thumbnail
    projectSchema.findOne({ "thumbnail": req.params.id })
        //.populate("thumbnail")
        .exec()
        .then(project => {

            ( project.gallery.length % 2 === 0 ) ? 
                res.render('project_v2', { project : project}) // pair
                : res.render('project', { project : project}); // impair
            
            //console.log("nb d'images : ", project.gallery.length);
            //console.log("id du projet : " + project._id);
        })
        .catch(error => {
            console.log(error)
        });
}

exports.aboutPage = (req, res) => {
    res.render('about')
};



// ***** Access to the admin panel *****

/*
 This code checks for the required fields, whether the passwords match, 
 and the length of the password. It then checks if the user already exists 
 in the database, and if not, it creates a new user with a hashed password and saves 
 the user to the database.

 Bcrypt is the hashing algorithm used to hash passwords before storing them in the DB.
 */


 // Render auth pages :

exports.loginPage = (req, res) => {
    res.render('login') // router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
}

exports.registerPage = (req, res) => {
    res.render('register') // router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));
}


// Register handle - POST :

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