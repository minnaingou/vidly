require("express-async-errors");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/database")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server listening on port", port);
});
