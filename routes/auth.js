const express = require("express");
const router = express.Router();
const cors = require("cors");
const User = require("../models/user");
const { login, register, getUser, logout } = require("../controllers/auth");

router.use(cors());

router.post("/login", login);

router.post("/register", register);

router.get("/user", getUser);

router.get("/", (req, res) => {
  res.send("Auth route");
});

router.get("/logout", logout);

module.exports = router;
