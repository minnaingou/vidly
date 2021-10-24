const express = require("express");

const authMiddleware = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Rental, validator } = require("../models/rental");
const { Movie } = require("../models/movie");

const router = express.Router();

router.post(
  "/",
  [authMiddleware, validate(validator)],
  async (req, res) => {
    console.log(Rental)
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) {
      return res.status(404).send("Rental not found");
    }

    if (rental.dateReturned) {
      return res.status(401).send("Already returned");
    }

    rental.return();
    await rental.save();

    await Movie.updateOne(
      { _id: rental.movie._id },
      { $inc: { numberInStock: 1 } }
    );

    return res.status(200).send(rental);
  }
);

module.exports = router;
