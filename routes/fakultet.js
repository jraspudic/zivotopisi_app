const express = require("express");
const router = express.Router();

//Fakultet i Studij model
const Fakultet = require("../models/Fakultet");
const Studij = require("../models/Studij");

router.get("/", (req, res) => {
  Fakultet.find().then(fakultets => res.json(fakultets));
});

router.post("/", (req, res) => {
  const newFakultet = new Fakultet({
    naziv: req.body.naziv
  });
  newFakultet.save().then(fakultet => res.json(fakultet));
});

router.get("/studiji", (req, res) => {
  Studij.find().then(studij => res.json(studij));
});

router.post("/studiji", (req, res) => {
  const newStudij = new Studij({
    naziv: req.body.naziv,
    fakultet: req.body.fakultet
  });
  newStudij.save().then(studij => res.json(studij));
});

module.exports = router;
