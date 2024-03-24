const mongoose = require("mongoose");

const movie = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateText: {
    type: String,
    required: false,
  },
  movieUrl: {
    type: String,
    required: true,
  },
  cinemaName: {
    type: String,
    required: true,
  },
  cinemaUrl: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Movie", movie);
