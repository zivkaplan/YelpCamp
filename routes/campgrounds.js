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

router
    .route('/')

    //campgrounds index page
    .get(wrapAsync(campgroundsController.index))

    //add new campground POST request
    .post(
        isLoggedIn,
        validateCampground,
        wrapAsync(campgroundsController.createCampground)
    );

//add new campoground page
router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

router
    .route('/:id')

    // campground show page
    .get(wrapAsync(campgroundsController.showCampground))

    // campground update PUT request
    .put(
        isLoggedIn,
        isCampAuthor,
        validateCampground,
        wrapAsync(campgroundsController.updateCampground)
    )

    // campground delete DELETE request
    .delete(
        isLoggedIn,
        isCampAuthor,
        wrapAsync(campgroundsController.deleteCampground)
    );

//campground edit page
router.get(
    '/:id/edit',
    isLoggedIn,
    isCampAuthor,
    wrapAsync(campgroundsController.renderEditForm)
);

module.exports = router;
