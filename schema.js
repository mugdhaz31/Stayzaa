const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().min(3).messages({
      "string.empty": "Title cannot be empty",
      "string.min": "Title should be at least 3 characters long",
      "any.required": "Title is required",
    }),
    price: Joi.number().required().min(0).messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
      "any.required": "Price is required",
    }),
    rating: Joi.number().min(0).max(5).optional().allow('', null),
    location: Joi.string().required().messages({
      "string.empty": "Location cannot be empty",
      "any.required": "Location is required",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
      "any.required": "Country is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description cannot be empty",
      "any.required": "Description is required",
    }),
    category: Joi.string().required().messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),
    image: Joi.object({
      url: Joi.string().uri().optional().allow('', null),
      filename: Joi.string().optional().allow('', null),
    }).optional().allow(null),
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required().messages({
      "string.empty": "Comment cannot be empty",
      "any.required": "Comment is required",
    }),
    rating: Joi.number().required().min(1).max(5).messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot be more than 5",
      "any.required": "Rating is required",
    }),
  }).required()
});
