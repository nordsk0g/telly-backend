const showsRouter = require("express").Router();
const imdbScrapper = require("../../Open Source contributions/imdb-scrapper/index");
// const imdbScrapper = require("imdb-scrapper");
const slugify = require("slugify");

// Get trending shows
showsRouter.get("/", async (req, res, next) => {
  const result = await imdbScrapper.getTrending(5, "tv");
  console.log(result.trending);
  result.trending.forEach(show => {
    console.log(show);
    show.slug = slugify(show.name, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    });
    console.log(show);
  });
  res.json(result);
});

// Get data of specific show
showsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await imdbScrapper.getFull(id);
    console.log(result);
    result.slug = slugify(result.title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    });
    res.json(result);
  } catch (e) {
    console.error(e);
  }
});

module.exports = showsRouter;
