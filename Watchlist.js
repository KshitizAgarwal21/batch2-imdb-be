const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Watchlist = require("./Schema/WatchlistSchema");

router.post("/addtowatchlist", async (req, res) => {
  const userid = req.headers.authorization;
  const uid = jwt.verify(userid, "mysecretkey");
  console.log(uid.uid);
  const { id, original_title, poster_path, vote_average } = req.body;

  const newMovie = {
    userid: uid.uid,
    id: id,
    original_title: original_title,
    poster_path: poster_path,
    vote_average: vote_average,
  };

  const movie = new Watchlist(newMovie);

  const movieAdded = await movie.save();

  if (movieAdded) {
    console.log(movieAdded);
  }
});

router.get("/mywatchlist", async (req, res) => {
  const userid = req.headers.authorization;
  const uid = jwt.verify(userid, "mysecretkey");
  console.log(uid.uid);
  const results = await Watchlist.find({ userid: uid.uid });
  const obj = {
    results: results,
  };
  res.status(200).send(obj);
});

module.exports = router;
