const Movie = require("../models/movies");

exports.getMoviesByPage = async (req, res, next) => {
  const { page } = req.params;
  const currentPage = page > 0 ? page : 1;
  const movies = await Movie.find()
    .skip((currentPage - 1) * 10)
    .limit(10);

  res.status(200).json({ movies });
};
