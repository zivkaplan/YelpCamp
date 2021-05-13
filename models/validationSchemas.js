const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string(),
    }).required(),
});

module.exports.imagesSchema = Joi.array().items(
    Joi.object({
        path: Joi.string().required(),
        filename: Joi.string().required(),
    })
);

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required(),
    }).required(),
});
