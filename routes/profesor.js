const express = require("express"),
  app = express(),
  router = express.Router(),
  bodyParser = require("body-parser"),
  Profesor = require("../models/Profesor"),
  Fakultet = require("../models/Fakultet"),
  User = require("../models/User");
methodOverride = require("method-override");
var passwordGenerator = require("generate-password");
app.use(bodyParser.urlencoded({ extended: true }));

//create route
router.post("/", isAdmin, (req, res) => {
  Profesor.create(req.body.profesor, function(err, noviProfesor) {
    if (err) console.log("Error kod dodavanja profesora");
    else {
      var password = passwordGenerator.generate({
        length: 20,
        numbers: true
      });
      var newUser = new User({
        username: noviProfesor.mail,
        profesorId: noviProfesor._id
      });

      User.findOne({ profesorId: noviProfesor._id }, function(err, user) {
        if (user) {
          console.log("Postoji user/profesor vec");
          res.redirect("/profesor/add");
        }
      });
      User.register(newUser, password, function(err, user) {
        console.log(password);
        if (err) {
          console.log(err);
          return res.redirect("/profesor/add");
        } else {
          res.redirect("/");
        }
      });
      console.log("Dodan novi profesor: " + noviProfesor);
    }
  });
  res.redirect("/");
});

//new route
router.get("/add", isAdmin, (req, res) => {
  Fakultet.find({}, (err, sviFakulteti) => {
    if (err) {
      console.log(err);
    } else {
      res.render("createProfesor", { fakulteti: sviFakulteti });
    }
  });
});

//show route
router.get("/:id", (req, res) => {
  Profesor.findById(req.params.id, function(err, pronadjenProfesor) {
    if (err) {
      console.log("Tražen je nepostojeci korisnik111111");
      res.redirect("/");
    } else {
      res.render("profesor", { profesor: pronadjenProfesor });
    }
  });
});
//edit route
router.get("/:id/edit", isAdminOrProfesor, (req, res) => {
  Profesor.findById(req.params.id, function(err, pronadjenProfesor) {
    if (err) {
      res.redirect("/");
    } else {
      res.render("editProfesor", { profesor: pronadjenProfesor });
    }
  });
});

//update route
router.put("/:id", isAdminOrProfesor, (req, res) => {
  Profesor.findByIdAndUpdate(req.params.id, req.body.profesor, function(
    err,
    editovanProfesor
  ) {
    if (err) {
      console.log("Tražen je nepostojeci korisnik");
      res.redirect("/");
    } else {
      User.findOneAndUpdate(
        { profesorId: req.params.id },
        { username: req.body.profesor.mail },
        (err, editovanUser) => {
          if (err) {
            console.log(err);
            console.log("Error kod editovonja prof usera");
          } else {
            console.log("Editovan juzer je " + editovanUser);
            //console.log("User uspjesno editovan: " + editovanUser.username);
          }
        }
      );

      idProfesora = editovanProfesor._id;
      console.log("profesor ažuriran: " + editovanProfesor);
      res.redirect("/profesor/" + editovanProfesor._id);
    }
  });
});

//destroy route
router.delete("/:id", isAdmin, function(req, res) {
  Profesor.findByIdAndDelete(req.params.id, function(err, pobrisanProfesor) {
    if (err) {
      console.log("Tražen je nepostojeci korisnik");
      res.redirect("/");
    } else {
      User.findOneAndRemove(
        { profesorId: pobrisanProfesor._id },
        (err, pobrisanUser) => {
          if (err) {
            console.log("Error delete route for user");
          } else {
            console.log("User je pobrisan: " + pobrisanUser);
          }
        }
      );
      console.log("profesor pobrisan: " + pobrisanProfesor);
    }
  });

  res.redirect("/");
});

function isAdmin(req, res, next) {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (req.user.isAdmin == false) {
    return res.redirect("/");
  }
  next();
}

function isAdminOrProfesor(req, res, next) {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (
    req.user.isAdmin == false &&
    req.user.profesorId != req.params.id
  ) {
    return res.redirect("/");
  }
  next();
}
//AUTH routes

module.exports = router;
