const express = require("express");
const cors = require("cors");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const mongodbUri =
  "mongodb+srv://christian:MM8xTBxHCwp186t9@cluster0.5uqboef.mongodb.net/movie-crawler?retryWrites=true&w=majority";

mongoose
  .connect(mongodbUri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

const crawlerRoutes = require("./routes/crawler");
const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 3001;

require("dotenv").config();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({ secret: "my-secret", resave: false, saveUninitialized: false })
);

app.use("/crawl", crawlerRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
