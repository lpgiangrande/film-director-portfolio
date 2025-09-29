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

// Render home page with all thumbnails sorted by release date descending
const homePage = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find()
      .populate('project')
      .sort({ releaseDate: -1 })
      .exec();
    res.render('index', { thumbnailsList: thumbnails, cdnUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send(ERROR_MESSAGE);
  }
};

// Render animation page
const animationPage = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ category: 'animation' })
      .populate('project')
      .sort({ releaseDate: -1 })
      .exec();
    res.render('animation', { thumbnailsList: thumbnails, cdnUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send(ERROR_MESSAGE);
  }
};

// Render live action page
const liveActionPage = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find({ category: 'liveaction' })
      .populate('project')
      .sort({ releaseDate: -1 })
      .exec();
    res.render('liveaction', { thumbnailsList: thumbnails, cdnUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send(ERROR_MESSAGE);
  }
};

// Render full project page based on thumbnail ID
const seeFullProject = async (req, res) => {
  try {
    const thumbnailId = req.params.id;

    if (thumbnailId === 'favicon.ico') return;

    if (!mongoose.Types.ObjectId.isValid(thumbnailId)) {
      return res.status(400).send('Invalid thumbnail ID');
    }

    const project = await Project.findOne({ thumbnail: thumbnailId })
      .populate('thumbnail')
      .exec();

    if (!project) return res.status(404).send('Project not found');

    const viewTemplate = project.gallery.length % 2 === 0 ? 'project_v2' : 'project';
    res.render(viewTemplate, { project, cdnUrl });
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
  aboutPage,
  loginPage,
  registerPage,
  handleRegistration
};

export default mainController;