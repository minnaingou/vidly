const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: String,
});

const Genre = mongoose.model("Genre", genreSchema);

const validate = (genres) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(genres);
};

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validate;
