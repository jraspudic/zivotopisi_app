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

router.post("/sendCredentials", function(req, res, next) {
  console.log("tusmo");
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          console.log("token je: >>>>>>>>>>>>>>>" + token + "<<<<<<<<<<<<<<");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ username: req.body.mail }, function(err, user) {
          if (!user) {
            console.log("Error, user nije pronadjen");
            res.redirect("/");
          }
          console.log("JUZER je: >>>>>>>>>>>>>>>" + user + "<<<<<<<<<<<<<<");
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
            user: "appzivotopisi@gmail.com",
            pass: "sveucilisteMostar309"
          }
        });
        var mailOptions = {
          to: user.username,
          from: "appzivotopisi@gmail.com",
          subject: "Podaci za login SUMzivotopisi",
          text:
            "Stipice ako si dobio ovaj mejl znaci da radi sve hehe idemo ga branit iduci tjedan" +
            "https://localhost:5000" +
            "/reset/" +
            token +
            "\n\n" +
            "Otiđite na ovaj link te unesite sifru za Vaš SUMzivotopisi korisnički račun.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log("mail sent");
          //res.render("forgotSent", { email: user.username });
          done(err, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/");
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
      res.render("promjeniSifru", { token: req.params.token });
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
              console.log(
                "Error password reset token ne postoji ili je istekao"
              );
              return res.redirect("/");
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
              console.log("Error, sifre se ne podudaraju");
              return res.redirect("back");
            }
          }
        );
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "appzivotopisi@gmail.com",
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: "appzivotopisi@gmail.com",
          subject: "SUMzivotopisi uspješno registriranje",
          text:
            "Pozdrav,\n\n" +
            "Ova je potrvrda da ste uspješno registrirali vaš SUMzivotopisi korisnički račun"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log("Uspješno promjenjena šifra");
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
