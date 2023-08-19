var express = require("express");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json()); // gives ability to the server to parse json requests
var PORT = process.env.PORT;

const api = require("./api");
const dbUrl = "mongodb+srv://Test:Test123@cluster0.nluje5t.mongodb.net/IMDB-DB";
const mongoose = require("mongoose");

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server  started successfully at port " + PORT);
});
mongoose.set("strictQuery", true);
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.log("some error occured " + e);
  });

app.use("/", api);
