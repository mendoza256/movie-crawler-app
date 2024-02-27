const express = require("express");
const router = express.Router();
const cors = require("cors");
const { getMoviesByPage } = require("../controllers/movies");

router.use(cors());

router.get("/:page", getMoviesByPage);

module.exports = router;
