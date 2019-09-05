var mongoose = require("mongoose");

var fakultetSchema = new mongoose.Schema({
  naziv: String,
  studiji: [{ naziv: String }]
});

module.exports = mongoose.model("Fakultet", fakultetSchema);
