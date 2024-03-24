const puppeteer = require("puppeteer");
const {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  processMoviesData,
  isRealMovieTitle,
  autoScroll,
} = require("../lib/utils.js");
const { listOfCinemas } = require("../lib/hardcodedData.js");
const Movie = require("../models/movies.js");

async function evaluateMoviesFromCinemaPage(page, url, cinema) {
  try {
    await page.goto(url);
    await page.waitForSelector(".btn.outline.pull-right");
    await page.click(".btn.outline.pull-right");
    await autoScroll(page);
    await page.waitForSelector(cinema.parentEl);
    await page.waitForSelector(cinema.titleFieldEl);
    await autoScroll(page, ".page-start");
    const movieResults = await page.evaluate((cinema) => {
      const movieElements = document.querySelectorAll(cinema.parentEl);

      const results = [];
      for (el of movieElements) {
        const title = el.querySelector(cinema.titleFieldEl)?.innerText || "";
        const urlString = el.querySelector("a")?.href || cinema.urlString;
        const dateEl = cinema.dateFieldEl
          ? el.querySelector(cinema.dateFieldEl)?.innerText || ""
          : "";
        const dateRegex = new RegExp(cinema.dateRegex);
        const actualDate = dateEl?.match(dateRegex)?.[0]?.trim() || "";

        results.push({
          title,
          dateText: actualDate,
          movieUrl: urlString,
          cinemaName: cinema.name,
          cinemaUrl: cinema.urlString,
        });
      }
      return results;
    }, cinema);

    console.log(movieResults);

    return processMoviesData(movieResults);
  } catch (error) {
    console.error("Error during crawling:", error);
    throw error;
  }
}

exports.crawlCinemas = async (req, res, next) => {
  console.log("start crawling...");
  try {
    const browser = await puppeteer.launch({
      // headless: "new",
      headless: false,
      slowMo: 150,
      args: ["--disable-features=site-per-process"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 640,
      height: 780,
      deviceScaleFactor: 1,
    });
    const movieTitles = [];

    for (const cinema of listOfCinemas) {
      console.log("crawl cinema:", cinema.name);
      const url = returnUrlForCurrentProgramme(cinema.urlString);
      const data = await evaluateMoviesFromCinemaPage(page, url, cinema, null);
      movieTitles.push(data);
    }
    const flatArrayofMovies = movieTitles.flat();

    for (const movie of flatArrayofMovies) {
      console.log(movie);
      const newMovie = new Movie({
        title: movie.title,
        dateText: movie.dateText,
        movieUrl: movie.movieUrl,
        cinemaName: movie.cinemaName,
        cinemaUrl: movie.cinemaUrl,
      });

      console.log("Saving movie to database:", newMovie);
      await newMovie.save();
    }

    await browser.close();
    console.log("crawling finished");
    res.status(200).json({ movieTitles: movieTitles });
  } catch (error) {
    console.error("Error during crawling:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
