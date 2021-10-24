const winston = require("winston");
require("winston-mongodb");

console.log("creating logger");
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27010/vidly",
      level: "error",
    }),
  ],
});

module.exports = logger;
