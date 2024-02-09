const express = require("express");
const cors = require("cors");
const app = express();
const crawlerRoutes = require("./routes/crawler");
const { Pool } = require("pg");
const PORT = process.env.PORT || 3001;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use("/crawl", crawlerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
