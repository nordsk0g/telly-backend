const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const reviewsRouter = require("./controllers/reviews");
const searchRouter = require("./controllers/search");
const showsRouter = require("./controllers/shows");
const actorRouter = require("./controllers/actor");
const authRouter = require("./controllers/auth");
const trendingRouter = require("./controllers/trending");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");

// TODO: mongoose connect

app.use(express.json());
app.use(cors());
// app.use(express.static("build"));
app.use(middleware.requestLogger);


// ROUTES
app.use("/reviews", reviewsRouter);
app.use("/search", searchRouter);
app.use("/shows", showsRouter);
app.use("/actor", actorRouter);
// app.use("/trending", trendingRouter);

// REGISTRATION and LOGIN
app.use("/auth", authRouter)

app.use(middleware.unknownEndpoint);
// TODO: errorHandler middleware

module.exports = app;
