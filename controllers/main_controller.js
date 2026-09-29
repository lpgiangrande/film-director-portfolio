import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Thumbnail from '../models/Thumbnails.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Biography from '../models/Biography.js';
import cdnUrl from '../utils/cdn.js';

const ERROR_MESSAGE = 'Sorry, we could not retrieve the data at this time. Please try again later.';

/** 
 * Page rendering functions
 */

// Render a thumbnails gallery (sorted by release date descending), each thumbnail linking to its project page
const renderGallery = (view, filter = {}) => async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find(filter).sort({ releaseDate: -1 }).exec();

    // thumbnail id -> /project/<slug> (the link is on the project side: Project.thumbnail)
    const projects = await Project.find({ thumbnail: { $ne: null } }, 'thumbnail slug').exec();
    const projectUrls = Object.fromEntries(projects.map(p => [String(p.thumbnail), p.url]));

    res.render(view, { thumbnailsList: thumbnails, projectUrls, cdnUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send(ERROR_MESSAGE);
  }
};

const homePage = renderGallery('index');
const animationPage = renderGallery('animation', { category: 'animation' });
const liveActionPage = renderGallery('liveaction', { category: 'liveaction' });

// Render full project page: /project/<slug>
const seeFullProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug }).populate('thumbnail').exec();
    if (project) return res.render('project', { project, cdnUrl });

    // Former slug (the title was changed since): permanent redirect to the current URL
    const renamed = await Project.findOne({ previous_slugs: slug }, 'slug').exec();
    if (renamed) return res.redirect(301, renamed.url);

    res.status(404).send('Project not found');
  } catch (error) {
    console.error(error);
    res.status(500).send(ERROR_MESSAGE);
  }
};

// Former URLs /<thumbnail id>: permanent redirect to /project/<slug>, so old links and search results still work
const seeFullProject = async (req, res) => {
  try {
    const thumbnailId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(thumbnailId)) {
      return res.status(404).send('Page not found');
    }

    const project = await Project.findOne({ thumbnail: thumbnailId }, 'slug').exec();

    if (!project || !project.slug) return res.status(404).send('Project not found');

    res.redirect(301, project.url);
  } catch (error) {
    console.error(error);
    res.status(500).send(ERROR_MESSAGE);
  }
};

// Render about page
const aboutPage = async (req, res, next) => {
  try {
    const biography = await Biography.findOne().exec();
    if (!biography) return res.status(404).send('Biography entry not found');
    res.render('about', { biography, cdnUrl });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Render login page
const loginPage = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken(), // Fournit csrfToken à la vue
  });
};

// Render register page
const registerPage = (req, res) => {
  res.render('register', {
    csrfToken: req.csrfToken(),
  });
};


// Handle user registration
const handleRegistration = async (req, res) => {
  const { username, pwd, pwd2 } = req.body;
  const errors = [];

  if (!username || !pwd || !pwd2) errors.push({ msg: 'Fields should not be empty' });
  if (pwd !== pwd2) errors.push({ msg: 'Passwords do not match' });
  if (pwd.length < 6) errors.push({ msg: 'Password should be at least 6 characters' });

  if (errors.length > 0) {
    return res.render('register', { errors, username, pwd, pwd2 });
  }

  try {
    const userCount = await User.countUsers();
    if (userCount >= 2) {
      errors.push({ msg: 'Only two users are allowed.' });
      return res.render('register', { errors, username, pwd, pwd2 });
    }

    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      errors.push({ msg: 'User already registered' });
      return res.render('register', { errors, username, pwd, pwd2 });
    }

    const hashedPwd = await bcrypt.hash(pwd, 10);

    const newUser = new User({ username, pwd: hashedPwd });
    await newUser.save();

    req.flash('success_msg', 'You are now registered. You can log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while registering user');
  }
};

const mainController = {
  homePage,
  animationPage,
  liveActionPage,
  seeFullProject,
  seeFullProjectBySlug,
  aboutPage,
  loginPage,
  registerPage,
  handleRegistration
};

export default mainController;