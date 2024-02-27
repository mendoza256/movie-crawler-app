const express = require("express");
const router = express.Router();
const crawlerController = require("../controllers/crawler");
const authenticateJWT = require("../middleware/auth");
const ensureSuperAdmin = require("../middleware/crawler");

router.get(
  "/",
  authenticateJWT,
  ensureSuperAdmin,
  crawlerController.crawlCinemas
);

module.exports = router;
