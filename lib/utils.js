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

function cleanUpMovieTitles(movieTitle) {
  const noNewLines = movieTitle.replace(/\\[n,t]/g, " ").trim();
  for (const series of cinemaSeries) {
    console.log("series name:", series);
    if (noNewLines.includes(series)) {
      const withRemovedSeriesName = noNewLines.replace(series, "").trim();
      return withRemovedSeriesName.replace(/:/g, "").trim();
    }
  }
  return noNewLines;
}

function isRealMovieTitle(movieTitle) {
  if (movieTitle.includes("…")) return false;
  return movieTitle !== "Functional Cookies";
}

module.exports = {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  checkIfUrlHasDate,
  cleanUpMovieTitles,
  isRealMovieTitle,
};
