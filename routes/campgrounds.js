const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const campgroundsController = require('../controllers/campgrounds');
//middleware
const {
    isLoggedIn,
    isCampAuthor,
    validateCampground,
} = require('../middleware');

//campgrounds index page
router.get('/', wrapAsync(campgroundsController.index));

//add new campoground page
router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

//add new campground POST request
router.post(
    '/',
    isLoggedIn,
    validateCampground,
    wrapAsync(campgroundsController.createCampground)
);

// campground show page
router.get('/:id', wrapAsync(campgroundsController.showCampground));

//campground edit page
router.get(
    '/:id/edit',
    isLoggedIn,
    isCampAuthor,
    wrapAsync(campgroundsController.renderEditForm)
);

// campground update PUT request
router.put(
    '/:id',
    isLoggedIn,
    isCampAuthor,
    validateCampground,
    wrapAsync(campgroundsController.updateCampground)
);

// campground delete DELETE request
router.delete(
    '/:id',
    isLoggedIn,
    isCampAuthor,
    wrapAsync(campgroundsController.deleteCampground)
);

module.exports = router;
