const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");

const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

mongoose.modelSchemas = {}; //dirty fix for Fawn complaining not mongoose instance
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invalid movie");
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send("Invalid customer");
  }

  const rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer.id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
  });
  await new Fawn.Task()
    .save("rentals", rental)
    .update(
      "movies",
      { _id: movie._id },
      {
        $inc: { numberInStock: -1 },
      }
    )
    .run(); //Fawn will create it's own collection in db
  res.send(rental);
});

module.exports = router;
