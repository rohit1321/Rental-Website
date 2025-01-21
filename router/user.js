const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controller/user.js")

router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(listingController.signUp)
);

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  listingController.login
);

//Loggout Router
router.get("/logout",listingController.LoggOutRoute);

module.exports = router;
