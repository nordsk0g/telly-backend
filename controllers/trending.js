const trendingRouter = require("express").Router();

trendingRouter.get("/", async (req, res) => {
  const results = await imdbScrapper.getTrending(5, "tv");
  console.log(results);
  res.json(results);
});

module.exports = trendingRouter;
