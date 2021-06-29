require('dotenv').config();
const showsRouter = require("express").Router();
// const imdbScrapper = require("../../Open Source contributions/imdb-scrapper/index");
// const imdbScrapper = require("imdb-scrapper");
// const slugify = require("slugify");
const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.TMDB_KEY);


// Get trending shows
showsRouter.get("/", async (req, res, next) => {
  const TRENDING_SHOW_COUNT = 6;
  const result = [];
  const trending = await moviedb.trending({media_type: 'tv', time_window: 'week'})

  for (let i = 0; i < TRENDING_SHOW_COUNT; i++) {
    result.push({
      name: trending.results[i].name,
      id: trending.results[i].id,
      poster: `http://image.tmdb.org/t/p/w200${trending.results[i].poster_path}`
    })
  }

  res.json(result);
});

// Get data of specific show
showsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const info = await moviedb.tvInfo({id: id});
    const credits = await moviedb.tvCredits({id: id});
    info.poster_path = `http://image.tmdb.org/t/p/w342${info.poster_path}`
    info.backdrop_path = `http://image.tmdb.org/t/p/w1280${info.backdrop_path}`
    // result.slug = slugify(result.title, {
    //   lower: true,
    //   remove: /[*+~.()'"!:@]/g
    // });
    res.json({credits, info}); 
  } catch (e) {
    console.error(e);
  }
});

async function updatePoster(show) { 
  const tempShow = await imdbScrapper.scrapper(show.id);
  
  return {
    name: show.name,
    poster: tempShow.poster,
    id: show.id,
    slug: show.slug
  }
}

module.exports = showsRouter;
