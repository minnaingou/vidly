const mongoose = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("../models/genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: String,
    genre: genreSchema,
    numberInStock: Number,
    dailyRentalRate: Number,
  })
);

const validate = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(movie);
};

exports.Movie = Movie;
exports.validate = validate;
