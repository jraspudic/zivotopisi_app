var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  isAdmin: { type: Boolean, default: false },
  isHeadAdmin: { type: Boolean, default: false },
  profesorId: { type: mongoose.Schema.ObjectId, ref: "Profesor" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
