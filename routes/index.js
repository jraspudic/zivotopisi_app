const express = require("express");
const router = express.Router();
var passport = require("passport");
var async = require("async");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
var passwordGenerator = require("generate-password");

//Fakultet i Studij model
const Fakultet = require("../models/Fakultet");
const Studij = require("../models/Studij");
const User = require("../models/User");
const Profesor = require("../models/Profesor");

//index route
router.get("/", (req, res) => {
  Profesor.find({}, (err, profesori) => {
    if (err) console.log("err");
    else res.json(profesori);
  });
});

router.get("/register", isHeadAdmin, (req, res) => {
  return res.render("register");
});

router.post("/register", isHeadAdmin, (req, res) => {
  var password = passwordGenerator.generate({
    length: 20,
    numbers: true
  });
  var newUser = new User({
    username: req.body.username,
    isAdmin: true
  });

  User.findOne({ username: req.body.username }, function(err, user) {
    if (user) {
      console.log("Postoji user");
      res.redirect("/register");
    }
  });
  User.register(newUser, password, function(err, user) {
    console.log(password);
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      res.redirect("/");
    }
  });
});

router.get("/login", (req, res) => {
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

router.get("/logout", function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/admini", isHeadAdmin, (req, res) => {
  User.find({ isAdmin: true }, (err, admini) => {
    if (err) {
      console.log("Error u post ruit /admini");
    } else {
      res.render("admini", { admini: admini });
    }
  });
});

router.delete("/users/:id", isHeadAdmin, (req, res) => {
  User.findByIdAndDelete(req.params.id, function(err, admin) {
    if (err) {
      console.log("Admin za brisanje nije pronadjen.");
      res.redirect("/admini");
    } else console.log("Admin pobrisan: " + admin.username);
  });

  res.redirect("/admini");
});
/*********************************** RESET PASSWORD *******************/

router.post("/forgot", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ username: req.body.email }, function(err, user) {
          if (!user) {
            req.flash("error", "No account with that email address exists.");
            return res.render("forgotFailed");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 sat

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "jurica.raspudic@gmail.com",
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.username,
          from: "jurica.raspudic@gmail.com",
          subject: "GamingArena password reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "https://gamingarena.club" +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log("mail sent");
          res.render("forgotSent", { email: user.username });
          done(err, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

router.get("/reset/:token", function(req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", function(req, res) {
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "gamingarena5454@gmail.com",
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: "gamingarena5454@gmail.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash("success", "Success! Your password has been changed.");
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect("/");
    }
  );
});

function isHeadAdmin(req, res, next) {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (req.user.isHeadAdmin == false) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
