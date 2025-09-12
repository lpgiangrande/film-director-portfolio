/**
 * Admin Panel Routes
 */
import { Router } from 'express';
import * as backofficeController from '../controllers/backoffice_controller.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = Router();

// -------------------- General Admin Routes -------------------- //
router.get('/list', ensureAuthenticated, backofficeController.list);
router.get('/logoff', ensureAuthenticated, backofficeController.logoutController.logoff);

// -------------------- Biography Routes -------------------- //
router.get('/updateAbout', ensureAuthenticated, backofficeController.biographyController.updateBiography);
router.post('/updateAbout', ensureAuthenticated, backofficeController.biographyController.handleBiographyUpdate);

// -------------------- Thumbnail Routes -------------------- //
router.get('/uploadThumbnail', ensureAuthenticated, backofficeController.thumbnailController.uploadThumbnail);
router.post('/uploadThumbnail', ensureAuthenticated, backofficeController.thumbnailController.addThumbnail);
router.get('/updateThumbnail/:id', ensureAuthenticated, backofficeController.thumbnailController.updateThumbnail);
router.post('/thumbnailUpdated', ensureAuthenticated, backofficeController.thumbnailController.handleThumbnailUpdate);

// -------------------- Project Routes -------------------- //
router.get('/uploadProject', ensureAuthenticated, backofficeController.projectController.uploadProject);
router.post('/uploadProject', ensureAuthenticated, backofficeController.projectController.addProject);
router.get('/updateProject/:id', ensureAuthenticated, backofficeController.projectController.updateProject);
router.post('/projectUpdated', ensureAuthenticated, backofficeController.projectController.handleProjectUpdate);

// -------------------- Optional Routes -------------------- //
// router.get('/deleteThumbnail/:id', ensureAuthenticated, backofficeController.thumbnailController.deleteThumbnail);

export default router;
