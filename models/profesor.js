var mongoose = require("mongoose");

var profesorSchema = new mongoose.Schema({
  ime: String,
  prezime: String,
  email: String,
  ustanovaZaposlenja: String,
  datumZadnjegIzboraUZvanje: Date,
  akademskiStupanj: String,
  predmetiKojeIzvodi: [{ naziv: String }],
  studjiNaKojimaPredaje: [{ idStudija: String }],
  kratkiZivotopis: String,
  RadoviITakoTo: String,
  popisRadova: String
});

module.exports = mongoose.model("Profesor", profesorSchema);
