const showsRouter = require("express").Router();
const imdbScrapper = require("../../Open Source contributions/imdb-scrapper/index");

// Get trending shows
showsRouter.get("/", async (req, res, next) => {
  const result = await imdbScrapper.getTrending(5, "tv");
  console.log(result);
  res.json(result);
});

// Get data of specific show
showsRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const result = await imdbScrapper.getFull(id);
  console.log(result);
  res.json(result);
});

module.exports = showsRouter;
