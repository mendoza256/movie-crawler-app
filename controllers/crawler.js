const puppeteer = require("puppeteer");
const {
  nextSevenDays,
  returnUrlForCurrentProgramme,
  checkIfUrlHasDate,
  filterAndCleanMovieTitles,
} = require("../lib/utils.js");
const { listOfCinemas } = require("../lib/hardcodedData.js");
const Movie = require("../models/movies.js");

async function evaluateCinemaPage(page, url, cinema, date = nextSevenDays[0]) {
  try {
    await page.goto(url);
    const movieTitles = await page.$$eval(cinema.titleFieldEl, (elements) =>
      elements.map((el) => el.innerText)
    );

    return movieTitles.map((title) => ({
      title,
      cinema: cinema.name,
      date,
    }));
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
      const data = await evaluateCinemaPage(page, url, cinema, null);
      movieTitles.push(data);

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

    const filteredMovieTitles = filterAndCleanMovieTitles(movieTitles);

    for (const movie of filteredMovieTitles) {
      const newMovie = new Movie({
        title: movie.title,
        cinemas: movie.cinema,
        date: movie.date,
        url: returnUrlForCurrentProgramme(
          listOfCinemas.find((c) => c.name === movie.cinema).urlString,
          movie.date
        ),
      });

      const result = await newMovie.save();
      console.log("Saved movie to database:", result);
    }

    await browser.close();
    console.log("crawling finished");
    res.status(200).json({ movieTitles: filteredMovieTitles });
  } catch (error) {
    console.error("Error during crawling:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
