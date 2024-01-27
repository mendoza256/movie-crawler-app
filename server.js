// server.js
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors"); // Import the cors middleware
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/crawl", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      "https://www.yorck.de/en/films?sort=Popularity&date=2024-01-27&tab=daily&sessionsExpanded"
    );

    const movieTitles = await page.evaluate(() => {
      const titleElements = document.querySelectorAll("h3.whatson-film-title");
      const titles = Array.from(titleElements).map((titleElement) =>
        titleElement.textContent.trim()
      );
      return titles;
    });

    console.log("Movie Titles:", movieTitles);

    // Save movie information to MongoDB
    // const movieData = new Movie({
    //   title: "Movie Title",
    //   cinema: "Cinema Name",
    //   // Add more fields as needed
    // });
    // await movieData.save();

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
