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

  const alreadyExist = await Watchlist.findOne({ userid: uid.uid, id: id });
  if (alreadyExist) {
    res.status(200).send({ msg: "already exist" });
  } else {
    const movie = new Watchlist(newMovie);

    const movieAdded = await movie.save();

    if (movieAdded) {
      res.status(200).send({ msg: "movie added to watchlist" });
    }
  }
});

router.get("/mywatchlist", async (req, res) => {
  const userid = req.headers.authorization;
  try {
    const uid = jwt.verify(userid, "mysecretkey");
    console.log(uid);
    const results = await Watchlist.find({ userid: uid.uid });
    const obj = {
      results: results,
    };
    res.status(200).send(obj);
  } catch (e) {
    res.status(200).send("session is invalid");
  }
});

module.exports = router;
