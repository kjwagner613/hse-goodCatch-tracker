const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");
const isSignedin = require("./middleware/is-signed-in");
const passUserToView = require("./middleware/pass-user-to-view");
const goodCatchController = require("./controllers/goodCatch.js");


app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "css")));


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
 

app.use('/users/:userId/catches', require('./controllers/goodCatch')); // Add this line

 
app.use("/goodCatch", isSignedin, goodCatchController); // Corrected line, lowercase "i"

const authController = require("./controllers/auth.js");


const {
    companySites,
    eventCategories,
    corpDepartments,
} = require("./constants");

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "-1");
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.locals.companySites = companySites;
app.locals.eventCategories = eventCategories;
app.locals.corpDepartments = corpDepartments;

app.get("/", (req, res) => {
    res.render("index", {
        user: req.session.user,
    });
});

app.use("/auth", authController);
app.use(passUserToView);
app.use("/goodCatch", isSignedin, goodCatchController); // Corrected line, lowercase "i"

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});