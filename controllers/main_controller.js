/** 
 * 
 * This is a Node.js module that exports several functions 
 * to handle HTTP requests and render views using the Express framework. 
 * It also interacts with a MongoDB database using Mongoose ORM.
 * 
 * first 5 functions : display views for the user
 *  
 * The last functions are for the client to either register or login to access his admin panel. 
 * 
 *  /!\ the register function allows only 2 users, that are already registered. 
 * 
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const Thumbnail = require('../models/Thumbnails');
const Project = require('../models/Project');
const User = require('../models/User');


/**
 * Renders the home page by finding all the Thumbnails from the database and sorting them by release date in descending order.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 */
exports.homePage = async (req, res) => {

    try {
      const thumbnails = await Thumbnail.find().sort({ releaseDate: -1 });
      res.render('index', { thumbnailsList: thumbnails });
    } catch (err) {
      console.log(err);
      res.status(500).send('Sorry, we could not retrieve the data at this time. Please try again later.');
    }
};
  
/**
 * Renders the animation page and displays the list of animation thumbnails 
 * sorted by release date in descending order.
*/
exports.animationPage = async (req, res) => {

    try {
      const thumbnails = await Thumbnail.find({ category: 'animation' })
        .sort({ releaseDate: -1 })
        .exec();
  
      res.render('animation', { thumbnailsList: thumbnails });
    } catch (err) {
      console.log(err);
      res.status(500).send('Sorry, we could not retrieve the data at this time. Please try again later.');
    }
};
  

/**
 * Same with liveaction page. 
*/
exports.liveActionPage = async (req, res) => {
    try {
      const thumbnails = await Thumbnail.find({ category: 'liveaction' })
        .sort({ releaseDate: -1 })
        .exec();
  
      res.render('liveaction', { thumbnailsList: thumbnails });
    } catch (err) {
      console.log(err);
      res.status(500).send('Sorry, we could not retrieve the data at this time. Please try again later.');
    }
  };
  

/**
 * Render either homepage/:id, liveaction/:id, animation/:id.
 * Retrieves the project details from the DB based on the thumbnail ID.
 * Can render 2 different layouts depending on the number of img, 
 * in order to display a balanced and variable grid for the user.
 * 
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {string} req.params.id - The ID of the thumbnail.
 * @returns {void}
 */

exports.seeFullProject = async (req, res) => {
    try {
        const project = await Project.findOne({ "thumbnail": req.params.id })/*.populate("thumbnail")*/.exec();
        
        if (project.gallery.length % 2 === 0) {
            res.render('project_v2', { project: project }); // even
        } else {
            res.render('project', { project: project }); // odd
        }
        //console.log("nb d'images : ", project.gallery.length);
        //console.log("id du projet : " + project._id);
    } catch (error) {
        console.log(error);
        res.status(500).send('Sorry, we could not retrieve the data at this time. Please try again later.');
    }
}


/**
 * Render the view for the About page (biography, photo, contact infos).
 */
exports.aboutPage = (req, res) => {
    res.render('about')
};


// ***** ACCESS TO ADMIN PANEL *****

exports.loginPage = (req, res) => {
    res.render('login')
}

exports.registerPage = (req, res) => {
    res.render('register') 
}


/**
 * This code checks for the required fields, whether the passwords match, 
 * and the length of the password. It then checks if the user already exists 
 * in the database, and if not, it creates a new user with a hashed password and saves 
 * the user to the database.
 * Limit of 2 users.
 */
exports.handleRegistration =  async (req, res) => { 
    
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
        try {
          //check for nb of users already registered
            const userCount = await User.countUsers();
            if (userCount >= 2) {
                errors.push({ msg: 'Only two users are allowed.' });
                res.render('register', {
                    errors, 
                    username,
                    pwd,
                    pwd2
                });
            } else {
                const user = await User.findOne({ username: username});
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
                        username : username,
                        pwd : pwd
                    });
                   
                    // Hash pwd
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.pwd, salt, (err, hash) => {
                            if(err) throw err;
                            // Set pwd to hash
                            newUser.pwd = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered. You can log in.');
                                    res.redirect('/login')
                                })
                                .catch(err => console.log(err));
                        })
                    );
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}