const Movie = require("../models/Movie");

exports.checkTitlesForSeries = async (req, res, next) => {
  const movies = await Movie.find();
  const possiblyHaveSeries = movies.filter((movie) =>
    movie.title.includes(":")
  );
  const possibleSeriesNames = possiblyHaveSeries.map(
    (movie) => movie.title.split(":")[0]
  );
  const uniqueSeriesNames = [...new Set(possibleSeriesNames)];
  res.status(200).json({ uniqueSeriesNames });
};
