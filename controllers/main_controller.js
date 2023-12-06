import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Thumbnail from '../models/Thumbnails.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Biography from '../models/Biography.js';

const errorMessage = 'Sorry, we could not retrieve the data at this time. Please try again later.';

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


/**
 * Renders the home page by finding all the Thumbnails from the database and sorting them by release date in descending order.
 */
const homePage = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find()
      .populate('project')
      .sort({ releaseDate: -1 });

    res.render('index', { thumbnailsList: thumbnails });
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

/**
 * Renders the animation page and displays the list of animation thumbnails sorted by release date in descending order.
 */
const animationPage = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ category: 'animation' })
      .populate('project')
      .sort({ releaseDate: -1 })
      .exec();
    res.render('animation', { thumbnailsList: thumbnails });
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

/**
 * Renders the live action page and displays the list of live action thumbnails sorted by release date in descending order.
 */
const liveActionPage = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ category: 'liveaction' })
      .populate('project')
      .sort({ releaseDate: -1 })
      .exec();
    res.render('liveaction', { thumbnailsList: thumbnails });
  } catch (err) {
    console.log(err);
    res.status(500).send(errorMessage);
  }
};

/**
 * Render either homepage/:id, liveaction/:id, animation/:id.
 * Retrieves the project details from the DB based on the thumbnail ID.
 * Can render 2 different layouts depending on the number of img, 
 * in order to display a balanced and variable grid for the user.
 */
const seeFullProject = async (req, res) => {
  try {
    if (req.params.id === "favicon.ico") {
      // Skip processing for the /favicon.ico route
      return;
    }

    const project = await Project.findOne({ thumbnail: mongoose.Types.ObjectId(req.params.id) })
      .populate('thumbnail')
      .exec();

    if (!project) {
      res.status(404).send('Project not found.');
      return;
    }

    if (project.gallery.length % 2 === 0) {
      res.render('project_v2', { project: project }); // even
    } else {
      res.render('project', { project: project }); // odd
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(errorMessage);
  }
};

/**
 * Render the view for the About page (biography, photo, contact infos).
 */
const aboutPage = async (req, res, next) => {
  try {
    const biography = await Biography.findOne().exec();

    if (!biography) {
      console.log('Biography entry not found');
      return res.status(404).send('Biography entry not found');
    }

    console.log('Rendering about page with biography:', biography);
    res.render('about', { biography: biography });
  } catch (error) {
    console.log('Error:', error);
    next(error);
  }
};

/**
 * Render privacy policy page.
 */
// export const privacyPolicy = (req, res) => {
//   res.render('privacy-policy');
// };

/**
 * Render login page.
 */
const loginPage = (req, res) => {
  res.render('login');
};

/**
 * Render register page.
 */
const registerPage = (req, res) => {
  res.render('register');
};

/**
 * Handles user registration.
 */
const handleRegistration = async (req, res) => {
  console.log("req body : ", req.body);
  const { username, pwd, pwd2 } = req.body;
  let errors = [];

  // Check required fields
  if (!username || !pwd || !pwd2) {
    errors.push({ msg: 'Fields should not be empty' });
  }

  // Check Pwd match
  if (pwd !== pwd2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check pwd length
  if (pwd.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      pwd,
      pwd2
    });
  } else {
    try {
      // check for the number of users already registered
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
        const user = await User.findOne({ username: username });
        if (user) {
          // User exists
          errors.push({ msg: 'already registered' });
          res.render('register', {
            errors,
            username,
            pwd,
            pwd2
          });
        } else {
          const newUser = new User({
            username: username,
            pwd: pwd
          });

          // Hash pwd
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.pwd, salt, (err, hash) => {
              if (err) throw err;
              // Set pwd to hash
              newUser.pwd = hash;
              // Save user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered. You can log in.');
                  res.redirect('/login');
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
};

const mainController = {
  homePage,
  animationPage,
  liveActionPage,
  seeFullProject,
  aboutPage,
  // privacyPolicy,
  loginPage,
  registerPage,
  handleRegistration
};

export default mainController;
