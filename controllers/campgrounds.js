const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocodingClient
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();

    const campground = new Campground(req.body.campground);
    if (!geoData.body.features.length) {
        req.flash('error', "Camp's location was not found. Please try again.");
        return res.redirect('campgrounds/new');
    }
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map((img) => ({
        url: img.path,
        filename: img.filename,
    }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author');

    if (!campground) {
        req.flash('error', 'Campground was not found');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const images = req.files.map((img) => ({
        url: img.path,
        filename: img.filename,
    }));
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    campground.images.push(...images);
    await campground.save();
    req.flash('success', 'Successfuly updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    //DELETE middleware for reviews
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};
