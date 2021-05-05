const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const expressError = require('../utilities/expressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../models/validationSchemas');


const validateCampground = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next()
    }
};

//campgrounds index page
router.get('/', wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

//add new campoground page
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

//add new campground POST request
router.post('/', validateCampground, wrapAsync(async (req, res) => {
    // if (!req.body.campground) throw new expressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully added a new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}));

// campground show page
router.get('/:id', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

//campground edit page
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// campground update PUT request
router.put('/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// campground delete DELETE request
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    //DELETE middleware for reviews
    res.redirect('/campgrounds');
}));


module.exports = router;