const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const uuidv1 = require("uuid/v1");
const reviewsRouter = require("./controllers/reviews");
const searchRouter = require("./controllers/search");
const showsRouter = require("./controllers/shows");
const trendingRouter = require("./controllers/trending");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const imdbScrapper = require("../Open Source contributions/imdb-scrapper/index.js");
// const imdbScrapper = require("imdb-scrapper");

// TODO: mongoose connect

app.use(cors());
app.use(express.static("build"));
app.use(bodyParser.json());
app.use(middleware.requestLogger);

app.use("/reviews", reviewsRouter);
app.use("/search", searchRouter);
app.use("/shows", showsRouter);
app.use("/trending", trendingRouter);

app.use(middleware.unknownEndpoint);
// TODO: errorHandler middleware

module.exports = app;