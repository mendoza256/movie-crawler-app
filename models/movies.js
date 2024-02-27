const mongoose = require("mongoose");

const movie = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cinemas: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Movie", movie);
