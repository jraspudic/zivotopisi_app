var mongoose = require("mongoose");

var studijSchema = new mongoose.Schema({
  naziv: String,
  fakultet: { type: mongoose.Schema.ObjectId, ref: "Fakultet" }
});

module.exports = mongoose.model("Studij", studijSchema);
