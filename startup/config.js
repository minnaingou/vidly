const config = require("config");

module.exports = function () {
  if (!config.get("jwtSecretKey")) {
    console.error("FATAL ERROR: jwtSecretKey is not defined.");
    // throw new Error("FATAL ERROR: ..."); // should throw error for winston to handle
    //process.exit(1);
  }
};
