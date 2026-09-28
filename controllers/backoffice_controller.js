import mongoose from 'mongoose';
import Thumbnail from '../models/Thumbnails.js';
import Project from '../models/Project.js';
import Biography from '../models/Biography.js';

import * as thumbnailController from './thumbnailController.js';
import * as projectController from './projectController.js';
import * as logoutController from './logoutController.js';
import * as biographyController from './biographyController.js';

import { configurePassport, LocalStrategy, bcrypt, User, passport } from '../config/passport.js';

// Configure Passport
configurePassport(passport);

/**
 * Render the admin panel list of projects and thumbnails
 */
const list = async (req, res, next) => {
  try {
    const projects = await Project.find({}).sort({ project_title: 1 }).exec();
    const thumbnails = await Thumbnail.find({}).sort({ releaseDate: -1 }).exec();

    // thumbnail id -> title of its project page (a thumbnail without page leads to a 404 on the site)
    const projectTitleByThumbnail = Object.fromEntries(
      projects.filter(p => p.thumbnail).map(p => [String(p.thumbnail), p.project_title])
    );

    res.render('list', {
      projectsList: projects,
      thumbnailsList: thumbnails,
      projectTitleByThumbnail,
      username: req.user?.username || '',
      biography: res.locals.biography || null,
    });
  } catch (err) {
    console.error('Error fetching projects or thumbnails:', err);
    next(err);
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
