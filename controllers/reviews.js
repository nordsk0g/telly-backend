const reviewsRouter = require("express").Router();
// const Review = require('../models/review');
const slugify = require("slugify");
const uuidv1 = require("uuid/v1");

let reviews = [
  {
    id: 1,
    slug: slugify("Uncut Gems", { lower: true, remove: /[*+~.()'"!:@]/g }),
    title: "Uncut Gems",
    image:
      "https://m.media-amazon.com/images/M/MV5BZDhkMjUyYjItYWVkYi00YTM5LWE4MGEtY2FlMjA3OThlYmZhXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_UX182_CR0,0,182,268_AL_.jpg",
    content: "this movie is great!",
    user: "nordskog",
    likes: 50,
    date: "2019-05-30T17:30:31.098Z"
  },
  {
    id: 2,
    slug: slugify("The Lighthouse", { lower: true, remove: /[*+~.()'"!:@]/g }),
    title: "The Lighthouse",
    image:
      "https://m.media-amazon.com/images/M/MV5BZmE0MGJhNmYtOWNjYi00Njc5LWE2YjEtMWMxZTVmODUwMmMxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX182_CR0,0,182,268_AL_.jpg",
    content: "Amazing!",
    user: "nordskog",
    likes: 500,
    date: "2019-05-30T18:39:34.091Z"
  },
  {
    id: 3,
    title: "Hobson's Choice",
    slug: slugify("Hobson's Choice", { lower: true, remove: /[*+~.()'"!:@]/g }),
    image:
      "https://m.media-amazon.com/images/M/MV5BMDQ1MDQ2NWYtYzVjMC00ZjBiLWEwYjktNzNkYmU3MjgyMzkzL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_UX182_CR0,0,182,268_AL_.jpg",
    content: "A timeless film",
    user: "nordskog",
    likes: 5,
    date: "2019-05-30T19:20:14.298Z"
  }
];

reviewsRouter.get("/", (req, res, next) => {
  res.json(reviews);
});

reviewsRouter.post("/", (req, res, next) => {
  const body = req.body;

  if (!body.title || !body.content) {
    return res.status(400).json({
      error: "content missing"
    });
  }

  const review = {
    id: uuidv1(),
    slug: slugify(body.title, { lower: true }),
    title: body.title,
    content: body.content,
    date: new Date(),
    user: {
      username: body.username
    },
    likes: 0
  };

  reviews = reviews.concat(review);

  res.json(reviews);
});

reviewsRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  reviews = reviews.filter(review => review.id != id);

  res.status(204).end();
});

module.exports = reviewsRouter;
