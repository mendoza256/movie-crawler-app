const express = require("express");
const router = express.Router();
const crawlerController = require("../controllers/crawler");
const auth = require("../middleware/auth");
const crawler = require("../middleware/crawler");

router.get(
  "/",
  // auth.authenticateJWT,
  // crawler.ensureSuperAdmin,
  crawlerController.crawlCinemas
);

module.exports = router;
