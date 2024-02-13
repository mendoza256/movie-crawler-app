const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const crawlerRoutes = require("./routes/crawler");
const authRoutes = require("./routes/auth");
const pool = require("./db");
const PORT = process.env.PORT || 3001;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(
  session({ secret: "my-secret", resave: false, saveUninitialized: false })
);

app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM crawl_data");
    res.status(200).send(data.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

app.get("/setup", async (req, res) => {
  try {
    await pool.query(
      "Create table if not exists crawl_data (id serial primary key, url varchar(255), title varchar(255), cinema varchar(255), created_at timestamp default current_timestamp)"
    );
    res.status(200).json({ message: "Table created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

app.use("/crawl", crawlerRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
