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

function cleanUpMovieTitles(movie) {
  const noNewLines = movie.title.replace(/\\[n,t]/g, " ").trim();
  return noNewLines;
}

function isRealMovieTitle(movieTitle) {
  if (!movieTitle) return false;
  if (movieTitle === "") return false;
  if (movieTitle.includes("…")) return false;
  if (movieTitle === "Functional Cookies") return false;
  return true;
}

function returnUniqueMovies(movieResults) {
  const uniqueMovies = [];
  const seenMovies = {};

  for (let i = 0; i < movieResults.length; i++) {
    const movie = movieResults[i];
    if (!seenMovies[movie.title]) {
      uniqueMovies.push(movie);
      seenMovies[movie.title] = true;
    }
  }

  return uniqueMovies;
}

function sortMoviesByTitle(movies) {
  return movies.sort((a, b) => a.title.localeCompare(b.title));
}

function returnTidiedMovieTitles(movieResults) {
  const uniqueMovies = returnUniqueMovies(movieResults);
  const sortedUniqueMovies = sortMoviesByTitle(uniqueMovies);

  return sortedUniqueMovies.filter((movie) => {
    return cleanUpMovieTitles(movie);
  });
}

function removeKnownSeriesFromMovieTitles(movieResults) {
  const updatedTitles = movieResults.map((movie) => {
    for (const serie of cinemaSeriesNames) {
      if (movie.title.includes(serie)) {
        return { title: movie.title.replace(serie, "").trim(), ...movie };
      }
    }
    return movie;
  });
  return updatedTitles;
}

function findAndRemoveSeriesNameInMovieTitles(movieResults) {
  const seenEventNames = {}; // Object to store indices of seen event series names

  const titlesWithoutSeriesName = [];

  for (let i = 0; i < movieResults.length; i++) {
    const currentMovie = movieResults[i];
    const parts = currentMovie.title.split(":");
    const eventName = parts[0];

    if (!seenEventNames[eventName]) {
      titlesWithoutSeriesName.push(movieResults[i]); // Keep title as-is (first occurrence)
      seenEventNames[eventName] = i; // Store the index of the first occurrence
    } else {
      // Check if current index is the same as the first occurrence index
      if (i !== seenEventNames[eventName]) {
        titlesWithoutSeriesName.push({
          ...currentMovie,
          title: parts.slice(1).join("").trim(),
        }); // Remove event name (subsequent occurrences)
      } else {
        titlesWithoutSeriesName.push(movieResults[i]); // Keep title as-is (second occurrence of the same series)
      }
    }
  }
  return titlesWithoutSeriesName;
}

function returnMovieTitlesWithoutSeriesName(movieResults) {
  const withoutKnownSeriesInTitle =
    removeKnownSeriesFromMovieTitles(movieResults);
  const cleanedTitles = returnTidiedMovieTitles(withoutKnownSeriesInTitle);
  return findAndRemoveSeriesNameInMovieTitles(cleanedTitles);
}

function processMoviesData(movieResults) {
  return returnMovieTitlesWithoutSeriesName(movieResults);
}

async function autoScroll(page) {
  let prevHeight = -1;
  let maxScrolls = 100;
  let scrollCount = 0;
  while (scrollCount < maxScrolls) {
    // Scroll to the bottom of the page
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    // Wait for page load
    await page.waitForTimeout(1000);
    // Calculate new scroll height and compare
    let newHeight = await page.evaluate("document.body.scrollHeight");
    if (newHeight == prevHeight) {
      break;
    }
    prevHeight = newHeight;
    scrollCount += 1;
  }
}

module.exports = {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  checkIfUrlHasDate,
  returnTidiedMovieTitles,
  returnMovieTitlesWithoutSeriesName,
  processMoviesData,
  isRealMovieTitle,
  autoScroll,
};
