var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Profesor = require("./models/Profesor"),
  Fakultet = require("./models/Fakultet"),
  methodOverride = require("method-override");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, {
    useNewUrlParser: true
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views")); //omogucava serviranje statickih fajlova u browser
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use("/", require("./routes/profesor"));
app.use("/fakulteti", require("./routes/fakultet"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
