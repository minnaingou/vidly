const express = require("express");

const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  Movie.find().then((result) => {
    res.send(result);
  });
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send("invalid genre");
  }
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie.save().then((result) => res.send(movie));
});

router.delete("/:id", authMiddleware, (req, res) => {
  const movie = Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).send("not found");
  }
  movie.remove().then((result) => res.send(result));
});

module.exports = router;
