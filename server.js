const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const authController = require("./controllers/auth.js");
const goodCatchController = require("./controllers/goodCatch.js");
const {
  companySites,
  eventCategories,
  corpDepartments,
} = require("./constants"); // Import constants

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("index", {
    user: req.session.user,
  });
});

app.use("/auth", authController);
app.use("/goodCatch", require("./controllers/goodCatch"));

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
