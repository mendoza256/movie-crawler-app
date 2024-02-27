const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function authenticateJWT(req, res, next) {
  const token = req.get("authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
};
