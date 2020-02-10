const express = require("express");

const imdbScrapper = require("imdb-scrapper");
const app = express();
const bodyParser = require("body-parser");
const uuidv1 = require("uuid/v1");

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method);
  console.log("Path: ", req.path);
  console.log("Body: ", req.body);
  console.log("---");

  next();
};

app.use(bodyParser.json());
app.use(requestLogger);

let reviews = [
  {
    id: 1,
    title: "Uncut Gems",
    content: "this movie is great!",
    date: "2019-05-30T17:30:31.098Z"
  },
  {
    id: 2,
    title: "The Lighthouse",
    content: "Robert Pattinson sucks in it",
    date: "2019-05-30T18:39:34.091Z"
  },
  {
    id: 3,
    title: "Hobson's Choice",
    content: "A timeless film",
    date: "2019-05-30T19:20:14.298Z"
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/reviews", (req, res) => {
  res.json(reviews);
});

app.get("/search", async (req, res) => {
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

app.get("/search/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const result = await imdbScrapper.getActor(id);
  res.json(result);
});

app.get("/trending", async (req, res) => {
  const results = await imdbScrapper.getTrending(5, "tv");
  console.log(results);
  res.json(results);
});

app.get("/show/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const result = await imdbScrapper.getFull(id);
  console.log(result);
  res.json(result);
});

app.post("/reviews", (req, res) => {
  const body = req.body;

  if (!body.title || !body.content) {
    return res.status(400).json({
      error: "content missing"
    });
  }

  const review = {
    id: uuidv1(),
    title: body.title,
    content: body.content,
    date: new Date(),
    likes: 0
  };

  reviews = reviews.concat(review);

  res.json(reviews);
});

app.delete("/reviews/:id", (req, res) => {
  const id = req.params.id;
  reviews = reviews.filter(review => review.id != id);

  res.status(204).end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
