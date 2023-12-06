/**
 * This file contains the routes for the admin panel
 */
import express from 'express';
import { Router } from 'express';
import mongoose from 'mongoose';
import * as backofficeController from '../controllers/backoffice_controller.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = Router();

// General Admin Routes
router.get('/list', ensureAuthenticated, backofficeController.list);
router.get('/logoff', ensureAuthenticated, backofficeController.logoutController.logoff);

// Biography Route
router.get('/updateAbout', ensureAuthenticated, backofficeController.biographyController.updateBiography);
router.post('/updateAbout', backofficeController.biographyController.handleBiographyUpdate);

// Thumbnail Routes
router.get('/uploadThumbnail', ensureAuthenticated, backofficeController.thumbnailController.uploadThumbnail);
router.post('/uploadThumbnail', backofficeController.thumbnailController.addThumbnail);
router.get('/updateThumbnail/:id', ensureAuthenticated, backofficeController.thumbnailController.updateThumbnail);
router.post('/thumbnailUpdated', ensureAuthenticated, backofficeController.thumbnailController.handleThumbnailUpdate);

// Project Routes
router.get('/uploadProject', ensureAuthenticated, backofficeController.projectController.uploadProject);
router.post('/uploadProject', backofficeController.projectController.addProject);
router.get('/updateProject/:id', ensureAuthenticated, backofficeController.projectController.updateProject);
router.post('/projectUpdated', ensureAuthenticated, backofficeController.projectController.handleProjectUpdate);

// Other Routes
// router.get('/deleteThumbnail/:id', ensureAuthenticated, backofficeController.deleteThumbnail);

export default router;
