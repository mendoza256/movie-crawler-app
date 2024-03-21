const { cinemaSeries } = require("./hardcodedData");

const months = [
  "januar",
  "februar",
  "märz",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "dezember",
];

const nextSevenDays = Array.from({ length: 1 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return date.toISOString().split("T")[0];
});

function checkIfUrlHasDate(url) {
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  return dateRegex.test(url);
}

function splitUrlByDate(url) {
  const dateRegex = /\d{4}-\d{2}-\d{2}/;
  return url.split(dateRegex);
}

function returnUrlForCurrentProgramme(url, date) {
  const splitUrl = splitUrlByDate(url);
  if (checkIfUrlHasDate(url) && date) {
    return `${splitUrl[0]}${date}${splitUrl[1]}`;
  } else {
    return url;
  }
}

function cleanUpMovieTitles(movie) {
  const movieTitle = movie.title;
  const noNewLines = movieTitle.replace(/\\[n,t]/g, " ").trim();
  return { ...movie, title: noNewLines };
}

function isRealMovieTitles(movie) {
  const movieTitle = movie.title;
  if (!movieTitle) return false;
  if (movieTitle === "") return false;
  if (movieTitle.includes("…")) return false;
  if (movieTitle === "Functional Cookies") return false;
  return true;
}

function returnUniqueMovies(movies) {
  return movies
    .flat()
    .filter(
      (movie, index, self) =>
        index ===
        self.findIndex(
          (t) => t.title === movie.title && t.cinema === movie.cinema
        )
    );
}

function sortMoviesByTitle(movies) {
  return movies.sort((a, b) => a.title.localeCompare(b.title));
}

function filterAndCleanMovieTitles(movies) {
  const realMovies = movies.filter((movie) => isRealMovieTitles(movie));
  const uniqueMovies = returnUniqueMovies(realMovies);
  const sortedUniqueMovies = sortMoviesByTitle(uniqueMovies);

  return sortedUniqueMovies.filter((movie) => {
    return cleanUpMovieTitles(movie.title);
  });
}

module.exports = {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  checkIfUrlHasDate,
  filterAndCleanMovieTitles,
};
