const express = require("express");
const router = express.Router();

//Fakultet model
const Fakultet = require("../models/Fakultet");

router.get("/", (req, res) => {
  Fakultet.find()
    .sort({ date: -1 })
    .then(fakultets => res.json(fakultets));
});

router.post("/", (req, res) => {
  const newFakultet = new Fakultet({
    naziv: req.body.naziv,
    studiji: req.body.studiji
  });
  newFakultet.save().then(fakultet => res.json(fakultet));
});

module.exports = router;
