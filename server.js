var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Profesor = require("./models/Profesor"),
  Fakultet = require("./models/Fakultet"),
  User = require("./models/User"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
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

/*********************************************************/
//PASSPORT CONFIGURATIONgit
app.use(
  require("express-session")({
    secret: "bilo sta mozes ovdje napisat nije bitno",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session(User.authenticate()));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*********************************************************/

app.use("/", require("./routes/index"));
app.use("/profesor", require("./routes/profesor"));
app.use("/fakulteti", require("./routes/fakultet"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
