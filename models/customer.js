const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: String,
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: String,
  })
);

const validate = (customers) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.number().required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customers);
};

exports.Customer = Customer;
exports.validate = validate;
