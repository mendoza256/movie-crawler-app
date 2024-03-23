const { cinemaSeriesNames } = require("./hardcodedData");

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
  return noNewLines;
}

function isRealMovieTitles(movieTitle) {
  if (!movieTitle) return false;
  if (movieTitle === "") return false;
  if (movieTitle.includes("…")) return false;
  if (movieTitle === "Functional Cookies") return false;
  return true;
}

function returnUniqueMovies(stringArray) {
  const uniqueMovies = [];
  const seenMovies = {};

  for (let i = 0; i < stringArray.length; i++) {
    const movie = stringArray[i];
    if (!seenMovies[movie]) {
      uniqueMovies.push(movie);
      seenMovies[movie] = true;
    }
  }

  return uniqueMovies;
}

function sortMoviesByTitle(movies) {
  return movies.sort((a, b) => a.localeCompare(b));
}

function returnTidiedMovieTitles(movies) {
  const realMovies = movies.filter((movie) => isRealMovieTitles(movie));
  const uniqueMovies = returnUniqueMovies(realMovies);
  const sortedUniqueMovies = sortMoviesByTitle(uniqueMovies);

  return sortedUniqueMovies.filter((movie) => {
    return cleanUpMovieTitles(movie);
  });
}

function removeKnownSeriesFromMovieTitles(titleElements) {
  const updatedTitles = titleElements.map((title) => {
    for (const serie of cinemaSeriesNames) {
      if (title.includes(serie)) {
        return title.replace(serie, "").trim();
      }
    }
    return title;
  });
  return updatedTitles;
}

function findAndRemoveSeriesNameInMovieTitles(titleElements) {
  const seenEventNames = {}; // Object to store indices of seen event series names

  const titlesWithoutSeriesName = [];

  for (let i = 0; i < titleElements.length; i++) {
    const titleElement = titleElements[i];
    const parts = titleElement.split(":");
    const eventName = parts[0];

    if (!seenEventNames[eventName]) {
      titlesWithoutSeriesName.push(titleElement); // Keep title as-is (first occurrence)
      seenEventNames[eventName] = i; // Store the index of the first occurrence
    } else {
      // Check if current index is the same as the first occurrence index
      if (i !== seenEventNames[eventName]) {
        titlesWithoutSeriesName.push(parts.slice(1).join("").trim()); // Remove event name (subsequent occurrences)
      } else {
        titlesWithoutSeriesName.push(titleElement); // Keep title as-is (second occurrence of the same series)
      }
    }
  }
  return titlesWithoutSeriesName;
}

function returnMovieTitlesWithoutSeriesName(titleElements) {
  const withoutKnownSeriesInTitle =
    removeKnownSeriesFromMovieTitles(titleElements);
  const cleanedTitles = returnTidiedMovieTitles(withoutKnownSeriesInTitle);
  return findAndRemoveSeriesNameInMovieTitles(cleanedTitles);
}

function processMoviesData(movieTitles, cinema, date) {
  const titlesWithoutSeriesName =
    returnMovieTitlesWithoutSeriesName(movieTitles);

  return titlesWithoutSeriesName.map((movieTitle) => ({
    title: movieTitle,
    cinema: cinema.name,
    urlString: cinema.urlString,
    date,
  }));
}

module.exports = {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  checkIfUrlHasDate,
  returnTidiedMovieTitles,
  returnMovieTitlesWithoutSeriesName,
  processMoviesData,
};
