const mongoose = require("mongoose");
const logger = require("../utils/logger");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27010/vidly")
    .then(() => logger.info("Mongodb connected"));
};
