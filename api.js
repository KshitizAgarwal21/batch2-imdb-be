const express = require("express");
const router = express.Router();

const login = require("./Login");
const watchlist = require("./Watchlist");
// const products = require("./Routes/Products");
// const user = require("./Routes/User");
// const sales = require("./Routes/Sales");
router.use("/login", login);
router.use("/watchlist", watchlist);
// router.use("/products", products);
// router.use("/user", user);
// router.use("/sales", sales);
module.exports = router;
