const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../models/validationSchemas');
const wrapAsync = require('../utilities/wrapAsync');
const expressError = require('../utilities/expressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

const validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
};

// campground add review POST request
router.post(
    '/',
    validateReview,
    wrapAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Successfully added your review');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// review delete DELETE request
router.delete(
    '/:reviewId',
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Review.findByIdAndDelete(reviewId);
        await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });
        req.flash('success', 'Successfully deleted your review');
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;
