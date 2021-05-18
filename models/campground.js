const mongoose = require('mongoose');
const Review = require('./review');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: String,
        location: {
            type: String,
            required: true,
        },
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        images: [ImageSchema],
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    },
    { toJSON: { virtuals: true } }
);

CampgroundSchema.virtual('properties.popUpmarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}"><h6>${this.title}</h6></strong></a><p>${this.location}</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
