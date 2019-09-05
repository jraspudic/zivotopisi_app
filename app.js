var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Profesor = require("./models/profesor"),
  Fakultet = require("./models/fakultet"),
  methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/zivotopisi_app", {
  useNewUrlParser: true
});
app.use(express.static("views")); //omogucava serviranje statickih fajlova u browser
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  Fakultet.create(req.body.profesor, function(err, noviProf) {
    if (err) console.log("error");
    else console.log("Dodan novi profesor: " + noviProf);
  });
  res.send("Hello World!");
});

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
