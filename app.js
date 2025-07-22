if(process.env.NODE_ENV != "production"){
  require("dotenv").config()
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
const User = require("./models/user");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

const app = express();

// Database connection
const dburl = process.env.MONGODB_URL;
mongoose.connect(dburl)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter: 24*3600
})

store.on("error",() =>{
  console.log("ERROR in MOGO SESSION STORE",err )
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};


app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global template variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Redirect root route to /listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});


// 404
app.use((req, res, next) => {
  res.status(404).render("error", {
    statusCode: 404,
    message: "Page Not Found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Internal Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong.";
  res.status(statusCode).render("error", { statusCode, message });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});