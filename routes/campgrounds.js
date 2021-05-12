const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const expressError = require('../utilities/expressError');
const Campground = require('../models/campground');
const {
    isLoggedIn,
    isCampAuthor,
    validateCampground,
} = require('../middleware');

//campgrounds index page
router.get(
    '/',
    wrapAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    })
);

//add new campoground page
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//add new campground POST request
router.post(
    '/',
    isLoggedIn,
    validateCampground,
    wrapAsync(async (req, res) => {
        if (!req.body.campground)
            throw new expressError('Invalid Campground Data', 400);
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', 'Successfully added a new campground');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// campground show page
router.get(
    '/:id',
    wrapAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id)
            .populate({ path: 'reviews', populate: { path: 'author' } })
            .populate('author');

        if (!campground) {
            req.flash('error', 'Campground was not found');
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    })
);

//campground edit page
router.get(
    '/:id/edit',
    isLoggedIn,
    isCampAuthor,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render('campgrounds/edit', { campground });
    })
);

// campground update PUT request
router.put(
    '/:id',
    isLoggedIn,
    isCampAuthor,
    validateCampground,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        await campground.update({ ...req.body.campground });
        req.flash('success', 'Successfuly updated campground');
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

// campground delete DELETE request
router.delete(
    '/:id',
    isLoggedIn,
    isCampAuthor,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        //DELETE middleware for reviews
        req.flash('success', 'Successfully deleted campground');
        res.redirect('/campgrounds');
    })
);

module.exports = router;
