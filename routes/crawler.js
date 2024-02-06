const express = require("express");
const router = express.Router();
const crawlerController = require("../controllers/crawler");

router.get("/", crawlerController.crawlCinemas);

module.exports = router;
