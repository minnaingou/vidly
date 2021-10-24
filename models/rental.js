const mongoose = require("mongoose");
const moment = require("moment");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: String,
      isGold: Boolean,
      phone: String,
    }),
  },
  movie: {
    type: new mongoose.Schema({
      title: String,
      dailyRentalRate: Number,
    }),
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: Date,
  rentalFee: Number,
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  console.log("rentalDays", rentalDays);
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model("Rental", rentalSchema);
const validate = (rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
};

exports.Rental = Rental;
exports.validate = validate;
