const puppeteer = require("puppeteer");
const {
  returnUrlForCurrentProgramme,
  processMoviesData,
  autoScroll,
} = require("../lib/utils.js");
const { listOfCinemas } = require("../lib/hardcodedData.js");
const Movie = require("../models/movies.js");
const { returnQueryString } = require("../lib/utils.js");

async function evaluateMoviesFromCinemaPage(page, url, cinema) {
  try {
    await page.goto(url);
    if (cinema.cookiePopup) {
      await page.waitForSelector(cinema.cookiePopup.buttonClass);
      await page.click(cinema.cookiePopup.buttonClass);
    }
    await autoScroll(page);
    await page.waitForSelector(cinema.parentEl);
    await page.waitForSelector(cinema.titleFieldEl);
    await autoScroll(page);
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
      args: ["--disable-features=site-per-process"],
      // toggle headless mode to debug
      headless: false,
      // headless: "new",
      slowMo: 50,
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

async function getTMDBMetadata(movie) {
  const tmdbTitle = returnQueryString(movie.title);
  console.log("tmdbTitle", tmdbTitle);

  const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${tmdbTitle}`;
  try {
    const response = await fetch(tmdbUrl);
    const data = await response.json();
    const tmdbMovie = data.results[0];
    if (tmdbMovie) {
      // tmdbData: movie,
      //     id: movie.id,
      //     title: movie.title,
      return {
        ...movie,
        tmdbData: tmdbMovie,
        id: tmdbMovie.id,
        title: tmdbMovie.title,
      };
    } else {
      console.error("Movie not found in TMDB:", movie.title);
    }
  } catch (error) {
    console.error("Error fetching movie from TMDB:", error);
  }
}

exports.addMetadata = async (req, res, next) => {
  try {
    const allDbMoviesWithoutId = await Movie.find({ id: { $exists: false } });

    for (const movie of allDbMoviesWithoutId) {
      // timeout set to avoid rate limiting
      setTimeout(async () => {
        const updatedMovie = await getTMDBMetadata(movie);
        const newMovie = new Movie(updatedMovie);
        try {
          await Movie.updateOne({ _id: movie._id }, newMovie);
        } catch (error) {
          console.error("Error updating movie:", error);
        }
      }, 500);
      // const updatedMovie = await getTMDBMetadata(movie);
      // const newMovie = new Movie(updatedMovie);
      // try {
      //   await Movie.updateOne({ _id: movie._id }, newMovie);
      // } catch (error) {
      //   console.error("Error updating movie:", error);
      // }
    }
  } catch (error) {
    console.error("Error movie update:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
