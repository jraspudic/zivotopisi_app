var mongoose = require("mongoose");

var profesorSchema = new mongoose.Schema({
  ime: String,
  prezime: String,
  mail: String
});

module.exports = mongoose.model("Profesor", profesorSchema);
