const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { User, validate } = require("../models/user");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  res.send(user);
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  const token = user.generateToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("not found");
    }
    user.name = req.body.name;
    const updatedUser = await user.save();
    return res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("not found");
  }
  const removed = await user.remove();
  return res.send(removed);
});

module.exports = router;
