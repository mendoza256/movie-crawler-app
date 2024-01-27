// server.js
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/movie-crawler", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const movieSchema = new mongoose.Schema({
  title: String,
  cinema: String,
  // Add more fields as needed
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
