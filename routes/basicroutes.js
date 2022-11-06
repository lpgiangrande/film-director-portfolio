/* Routes for the 4 main pages - GET */

const express = require("express");
const router = express.Router();
const mainController = require('../controllers/main_controller');



// HOME PAGE
router.get('/', mainController.homePage);

// PAGE 2 ANIMATION : only display thumbnails with category:animation
router.get('/animation/', mainController.animationPage);

// PAGE 3 LIVE ACTION : only display thumbnails with category: live action
router.get('/liveaction/', mainController.liveActionPage);

// PAGE 4 ABOUT
router.get('/about', mainController.aboutPage);

// Display project details when you clic on a homepage thumbnail
router.get('/:id', mainController.seeFullProject);



module.exports = router;