const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  original_title: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  vote_average: {
    type: String,
    required: true,
  },
});

const Watchlist = mongoose.model("mywatchlist", schema);

module.exports = Watchlist;
