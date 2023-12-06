import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';  
import Project from '../models/Project.js';  
import Biography from '../models/Biography.js';  
import * as thumbnailController from './thumbnailController.js'
import * as projectController from './projectController.js'
import * as logoutController from './logoutController.js'
import * as biographyController from './biographyController.js';  // Import biographyController
import { configurePassport, LocalStrategy, bcrypt, User, passport } from '../config/passport.js';

// Now, configure Passport
configurePassport(passport);


/**
 * This file contains @private functions for the admin panel.:
 * 
 *  - list: Renders a list of projects and thumbnails in a table
 * 
 *  - addProject: Adds a new project (a new web page)
 *  - updateProject: Handles the update of a project.
 *  - handleProjectUpdate: Submits the updated project.
 * 
 *  - addThumbnail: Adds a new Project's thumbnail for the homepage
 *  - updateThumbnail: Handles the update of a thumbnail.
 *  - handleThumbnailUpdate: Submits the updated thumbnail.
 *  
 *  - updateBio
 *  - handleBioUpdate
 */

// Define the list function
const list = async (req, res) => {
  try {
    const projects = await Project.find({});
    const thumbnails = await Thumbnail.find({});

    res.render('list', {
      projectsList: projects,
      thumbnailsList: thumbnails,
      username: req.user.username,
      biography: res.locals.biography,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  mongoose,
  Thumbnail,
  Project,
  Biography,
  configurePassport,
  LocalStrategy,
  bcrypt,
  User,
  passport,
  thumbnailController,
  projectController,
  logoutController,
  biographyController,
  list
};