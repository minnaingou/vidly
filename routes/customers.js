const express = require("express");

const authMiddleware = require("../middleware/auth");

const { Customer, validate } = require("../models/customer");

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  const saved = await customer.save();
  res.send(saved);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send("not found");
    }
    customer.name = req.body.name;
    const updatedCustomer = await customer.save();
    return res.send(customer);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).send("not found");
  }
  const removed = await customer.remove();
  return res.send(removed);
});

module.exports = router;
