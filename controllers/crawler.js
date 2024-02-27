const puppeteer = require("puppeteer");
const {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  checkIfUrlHasDate,
  cleanUpMovieTitles,
  isRealMovieTitle,
} = require("../lib/utils.js");
const { listOfCinemas } = require("../lib/hardcodedData.js");
const Movie = require("../models/movies.js");

async function evaluateCinemaPage(page, url, cinema, date) {
  if (!date) {
    date = nextSevenDays[0];
  }
  try {
    await page.goto(url);
    const movieTitles = await page.$$eval(cinema.titleFieldEl, (elements) =>
      elements.map((el) => el.innerText)
    );

    return movieTitles.map((title) => {
      return {
        title,
        cinema: cinema.name,
        date,
      };
    });
  } catch (error) {
    console.error("Error during crawling:", error);
    throw error;
  }
}

exports.crawlCinemas = async (req, res, next) => {
  console.log("start crawling...");
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--disable-features=site-per-process"],
    });
    const page = await browser.newPage();
    const movieTitles = [];

    for (const cinema of listOfCinemas) {
      console.log("crawl cinema:", cinema.name);
      const url = returnUrlForCurrentProgramme(cinema.urlString);
      await evaluateCinemaPage(page, url, cinema, null).then((data) => {
        movieTitles.push(data);
      });

      if (!checkIfUrlHasDate(cinema.urlString)) {
        console.log("Cinema has no date in URL. Skipping crawl per date...");
        continue;
      }

      for (const date of nextSevenDays) {
        console.log("crawl cinema:", cinema.name, "for date:", date);
        const urlWithDate = returnUrlForCurrentProgramme(
          cinema.urlString,
          date
        );
        const newMovietitles = await evaluateCinemaPage(
          page,
          urlWithDate,
          cinema,
          date
        );
        movieTitles.push(newMovietitles);
      }
    }

    const uniqueMovieTitles = movieTitles
      .flat()
      .filter((movie, index, self) => {
        return (
          index ===
          self.findIndex(
            (t) => t.title === movie.title && t.cinema === movie.cinema
          )
        );
      });
    const sortedUniqueMovieTitles = uniqueMovieTitles.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });

    const cleanedUpMovieTitles = sortedUniqueMovieTitles.map((movie) => {
      console.log("cleaning up movie titles...");
      const filteredAndFormattedMovie = cleanUpMovieTitles(movie.title);
      return { ...movie, title: filteredAndFormattedMovie };
    });

    const filteredMovieTitles = cleanedUpMovieTitles.filter((movie) => {
      console.log("checking if movie title is real...");
      return isRealMovieTitle(movie.title);
    });

    // save movies to database
    filteredMovieTitles.map(async (movie) => {
      const newMovie = new Movie({
        title: movie.title,
        cinema: movie.cinema,
        date: movie.date,
      });

      const result = await newMovie.save();
      console.log("Saved movie to database:", result);
    });

    await browser.close();
    console.log("crawling finished");
    res.status(200).json({ movieTitles: filteredMovieTitles });
  } catch (error) {
    console.error("Error during crawling:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
