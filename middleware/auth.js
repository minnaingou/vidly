const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, no token provided");

  try {
    const decoded = jwt.verify(
      token,
      config.get("jwtSecretKey") || "jwtsecret"
    );
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send("Access denied");
  }
};
