var mongoose = require("mongoose");

var profesorSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  mail: { type: String, required: true, unique: true },

  ustanovaZaposlenja: {
    type: mongoose.Schema.ObjectId,
    ref: "Fakultet"
  },
  fakultetiNaKojimaPredaje: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Fakultet"
    }
  ],
  datumZadnjegIzboraUZvanje: Date,
  akademskiStupanj: {
    type: String,
    enum: [
      "asistent",
      "visiAsisten",
      "predavac",
      "docent",
      "izvProf",
      "redProf"
    ]
  },
  predmetiKojeIzvodi: [{ naziv: String }],
  studijiNaKojimaPredaje: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Studij"
    }
  ],
  kratkiZivotopis: String,
  RadoviITakoTo: String,
  popisRadova: String
});

module.exports = mongoose.model("Profesor", profesorSchema);
