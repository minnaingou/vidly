const winston = require("winston");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaught.log" })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
