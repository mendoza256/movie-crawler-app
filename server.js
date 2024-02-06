// server.js
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors"); // Import the cors middleware
const app = express();
const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;
// use .env file to store sensitive data
require("dotenv").config();
const { nextSevenDays, splitCinemaNameAtDate } = require("./lib/utils.js");
const { listOfCinemas } = require("./lib/hardcodedData.js");

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.get("/crawl", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--disable-features=site-per-process"],
    });
    const page = await browser.newPage();
    const movieTitles = [];

    for (const cinema in listOfCinemas) {
      console.log("cinema", cinema);
      const splitURL = splitCinemaNameAtDate(listOfCinemas[cinema].urlString);
      for (const date of nextSevenDays) {
        await page.goto(`${splitURL[0]}${date}${splitURL[1]}`);

        movieTitles.push(
          page.evaluate(() => {
            const titleElements = document.querySelectorAll(
              listOfCinemas[cinema].titleFieldClass
            );
            const titles = titleElements.map((title) => title.innerText);
            return titles;
          })
        );

        // await Promise.all(
        //   page
        //     .evaluate(() => {
        //       const titleElements = document.querySelectorAll(
        //         listOfCinemas[cinema].titleFieldClass
        //       );
        //       const titles = titleElements.map((title) => title.innerText);
        //       return titles;
        //     })
        //     .then((titles) => {
        //       movieTitles.push(titles);
        //     })
        //     .catch((error) => {
        //       console.error("Error during crawling:", error);
        //       res.status(500).json({ error: "Internal Server Error" });
        //     })
        // );
      }

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
