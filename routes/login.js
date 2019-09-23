/*const express = require("express");
const router = express.Router();
var passport = require("passport");
//Fakultet i Studij model
const Fakultet = require("../models/Fakultet");
const Studij = require("../models/Studij");
const User = require("../models/User");

router.get("/", (req, res) => {
  if (req.user) {
    //req.session = null;
    return res.redirect("/");
  }
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),

  function(req, res) {}
);

module.exports = router*/
