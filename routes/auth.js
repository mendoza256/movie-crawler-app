const express = require("express");
const router = express.Router();
const cors = require("cors");
const { postLogin } = require("../controllers/auth");

router.use(cors());

router.get("/", (req, res) => {
  res.send("Auth route");
});

router.post("/login", postLogin);

module.exports = router;
