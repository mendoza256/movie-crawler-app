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
  },
  cinemaName: {
    type: String,
  },
  cinemaUrl: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  tmdbData: {
    type: Object,
    default: null,
  },
  id: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model("Movie", movie);
