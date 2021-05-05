const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    body: String,
    rating: {
        type: Number,
        min: [0, 'rating must be between 1-5'],
        max: [5, 'rating must be between 1-5'],
    },
});

module.exports = mongoose.model('Review', reviewSchema);
