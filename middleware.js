const Campground = require('./models/campground');
const Review = require('./models/review');
const {
    campgroundSchema,
    reviewSchema,
} = require('./models/validationSchemas');
const expressError = require('./utilities/expressError');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnToURL = req.originalUrl;
        req.flash('error', 'You must be logged in to view this page');
        return res.redirect('/login');
    }
    next();
};

const isCampAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground was not found');
        return res.redirect('/campgrounds');
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Unauthorized action');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

const validateCampground = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
};

const validateReview = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
};

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Unauthorized action');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports = {
    isLoggedIn,
    isCampAuthor,
    isReviewAuthor,
    validateCampground,
    validateReview,
};
