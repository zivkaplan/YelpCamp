const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: {
        type: Number,
        min: [0, 'rating must be between 1-5'],
        max: [5, 'rating must be between 1-5'],
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Review', reviewSchema);
