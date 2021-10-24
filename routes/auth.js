const express = require("express");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid user or password");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) {
    return res.status(400).send("Invalid user or password");
  }
  
  const token = user.generateToken();
  res.send(token);
});

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string(),
  });
  return schema.validate(req);
};

module.exports = router;
