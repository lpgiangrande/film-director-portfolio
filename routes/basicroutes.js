/* GET Routes for main pages (user) */

const express = require("express");
const router = express.Router();
const mainController = require('../controllers/main_controller');


router.get('/', mainController.homePage);
router.get('/animation/', mainController.animationPage);
router.get('/liveaction/', mainController.liveActionPage);
router.get('/about', mainController.aboutPage);
// Display project details when clic on a homepage/animation page/liveaction page thumbnail
router.get('/:id', mainController.seeFullProject);

module.exports = router;