const User = require("../models/user.js");


module.exports.signUp =async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registerUser = await User.register(newUser, password);
      req.login(registerUser, (error) => {
        if (error) {
          return next(error);
        }
        req.flash("success", "WellCome To Wanderlust");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

  module.exports.login = async (req, res) => {
    req.flash("success", "WellCome Back To Wanderlust.You are login..!");
    let redirectUrl =  res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }


module.exports.LoggOutRoute =  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next();
      }
      req.flash("success", "You Are Logged Out ..!");
      res.redirect("/listings");
    });
  };

