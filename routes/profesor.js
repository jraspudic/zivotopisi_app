const express = require("express"),
  app = express(),
  router = express.Router(),
  bodyParser = require("body-parser"),
  Profesor = require("../models/Profesor"),
  Fakultet = require("../models/Fakultet"),
  methodOverride = require("method-override");
app.use(bodyParser.urlencoded({ extended: true }));
//index route
router.get("/", (req, res) => {
  Profesor.find({}, (err, profesori) => {
    if (err) console.log("err");
    else res.render("profesori", { profesori: profesori });
  });
});

//create route
router.post("/", (req, res) => {
  Profesor.create(req.body.profesor, function(err, noviProfesor) {
    if (err) console.log("error");
    else console.log("Dodan novi profesor: " + noviProfesor);
  });
  res.redirect("/");
});

//new route
router.get("/dodaj", (req, res) => {
  res.render("createProfesor");
});

//show route
router.get("/:id", (req, res) => {
  Profesor.findById(req.params.id, function(err, pronadjenProfesor) {
    if (err) {
      console.log(err);
    } else {
      res.render("profesor.ejs", { profesor: pronadjenProfesor });
    }
  });
});
//edit route
router.get("/:id/edit", (req, res) => {
  Profesor.findById(req.params.id, function(err, pronadjenProfesor) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("editProfesor", { profesor: pronadjenProfesor });
    }
  });
});
//update route
router.put("/:id", (req, res) => {
  Profesor.findByIdAndUpdate(req.params.id, req.body.profesor, function(
    err,
    editovanProfesor
  ) {
    if (err) {
      console.log("error");
      res.redirect("/");
    } else {
      idProfesora = editovanProfesor._id;
      console.log("profesor ažuriran: " + editovanProfesor);
      res.redirect("/" + editovanProfesor._id);
    }
  });
});

//destroy route
router.delete("/:id", function(req, res) {
  Profesor.findByIdAndDelete(req.params.id, function(err, profesor) {
    if (err) console.log("error");
    else console.log("profesor pobrisan: " + profesor);
  });

  res.redirect("/");
});

module.exports = router;
