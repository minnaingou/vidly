const express = require("express");

const { Genre, validate } = require("../models/genre");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genre = new Genre({ name: req.body.name });
  genre.save().then((result) => res.send(result));
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  Genre.findById(req.params.id)
    .then((genre) => {
      if (!genre) {
        return res.status(404).send("not found");
      }
      genre.name = req.body.name;
      return genre.save();
    })
    .then((genre) => res.send(genre))
    .catch((err) => {
      console.log(err);
      return res.status(404).send(err);
    });
});

router.delete("/:id", [authMiddleware, adminMiddleware], async (req, res) => {
  const genre = Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send("not found");
  }
  genre.remove().then((result) => res.send(result));
});

module.exports = router;
