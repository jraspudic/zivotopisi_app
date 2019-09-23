/*const express = require("express");
const router = express.Router();
var passport = require("passport");
//Fakultet i Studij model
const Fakultet = require("../models/Fakultet");
const Studij = require("../models/Studij");
const User = require("../models/User");

router.get("/", (req, res) => {
  if (req.user) {
    req.session = null;
    return res.redirect("/");
  }
  return res.render("register");
});

router.post("/", (req, res) => {
  var newUser = new User({
    username: req.body.username
  });

  User.findOne({ username: req.body.username }, function(err, user) {
    if (user) {
      console.log("Postoji user legendice");
      res.redirect("/");
    }
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function() {
        console.log("Jel moguce da je isprve uspjelo????");
        res.redirect("/");
      });
    }
  });
});

module.exports = router;
*/
