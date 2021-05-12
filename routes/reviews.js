const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utilities/wrapAsync');
const reviewsController = require('../controllers/reviews');
//middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

// campground add review POST request
router.post(
    '/',
    isLoggedIn,
    validateReview,
    wrapAsync(reviewsController.addReview)
);

// review delete DELETE request
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewsController.deleteReview)
);

module.exports = router;
