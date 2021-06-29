const searchRouter = require("express").Router();
const imdbScrapper = require("imdb-scrapper");

searchRouter.get("/", async (req, res, next) => {
  let result;

  if (req.query.actor) {
    result = await imdbScrapper.searchActor(req.query.actor);
  } else if (req.query.term) {
    results = await imdbScrapper.simpleSearch(req.query.term);
  } else {
    res.status(404).end();
  }
  res.json(results.d);
});

searchRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const result = await imdbScrapper.getActor(id);
  res.json(result);
});

module.exports = searchRouter;
