const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  isAdmin: Boolean,
});

userSchema.methods.generateToken = function () {
  console.log(this._id, this.isAdmin, this)
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtSecretKey") || "jwtsecret"
  );
};

const User = mongoose.model("User", userSchema);

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required().email(),
    password: Joi.string(),
  });
  return schema.validate(user);
};

exports.User = User;
exports.validate = validate;
