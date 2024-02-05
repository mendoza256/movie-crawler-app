// server.js
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors"); // Import the cors middleware
const app = express();
const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;
// use .env file to store sensitive data
require("dotenv").config();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const listOfCinemas = [
  {
    URL: "https://www.yorck.de/en/films?sort=Popularity&date=2021-09-17&tab=daily&sessionsExpanded",
    name: "Yorck Kinos",
    titleFieldClass: "h3.whatson-film-title",
  },
  {
    URL: "https://www.hoefekino.de/programm-tickets/vorschau/woche/",
    name: "Hackesche Höfe Kino",
    titleFieldClass: "h2",
  },
];

app.get("/crawl", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--disable-features=site-per-process"],
    });
    const page = await browser.newPage();

    // get every day of the next week formatted as YYYY-MM-DD
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split("T")[0];
    });
    const movieTitles = [];

    for (const cinema in listOfCinemas) {
      const dateRegex = /\d{4}-\d{2}-\d{2}/;
      const splitURL = cinema.URL.split(dateRegex);
      for (const date of dates) {
        await page.goto(`${splitURL[0]}${date}${splitURL[1]}`);

        await Promise.all(
          page
            .evaluate(() => {
              const titleElements = document.querySelectorAll(
                cinema.titleFieldClass
              );
              const titles = Array.from(titleElements).map((titleElement) =>
                titleElement.textContent.trim()
              );
              return titles;
            })
            .then((titles) => {
              movieTitles.push(titles);
            })
            .catch((error) => {
              console.error("Error during crawling:", error);
              res.status(500).json({ error: "Internal Server Error" });
            })
        );
      }

      // const movieTitlesFlat = movieTitles.flat();
      // const movies = Array.from(new Set(movieTitlesFlat));

      console.log(movieTitles);
    }

    // return movie information to client
    await browser.close();

    res.status(200).json({ movieTitles });
  } catch (error) {
    console.error("Error during crawling:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
