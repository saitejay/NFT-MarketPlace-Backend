/*
Project : Cryptotrades
FileName : userModel.js
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which used to define user collection that will communicate and process user information with mongodb through mongoose ODM.
*/

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
var validator = require("validator");
var uniqueValidator = require("mongoose-unique-validator");
var config = require("./../../../helper/config");

// Setup schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: [1, "User Name must be 1 characters or more"],
    maxlength: [32, "User Name can't exceed 32 characters"],
    validate: [validator.isAlphanumeric, "UserName  must be alphanumeric"],
    required: [true, "User Name is required"],
  },
  email: {
    type: String,
    unique: [
      true,
      "Email already exists. Please try a different email address",
    ],
    validate: [validator.isEmail, "Oops, please enter a valid email address"],
    required: [true, "email is required"],
  },
  display_name: {
    type: String,
    minlength: [1, "Full Name must be 1 characters or more"],
    maxlength: [65, "Full Name can't exceed 65 characters"],
    required: [true, "Full Name is required"],
  },
  public_key: {
    type: String,
    unique: true,
    required: [true, "Public Key is required"],
  },
  bio: {
    type: String,
    maxlength: [160, "Bio can't exceed 160 characters"],
  },
  profile_image: String,
  profile_cover: String,
  facebook_username: {
    type: String,
  },
  twitter_username: {
    type: String,
  },
  instagram_username: {
    type: String,
  },
  role: { type: Number, default: 2 },
  is_notification: { type: Number, default: 1 },
  is_featured: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "inactive", "blocked", "reset"],
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.pre("save", function (next) {
//   var user = this;
//   if (!user.isModified("password")) return next();

//   if (user.password.length == 0) return next();
//   // generate a salt
//   bcrypt.genSalt(12, function (err, salt) {
//     if (err) return next(err);
//     // hash the password using our new salt
//     bcrypt.hash(user.password, salt, function (err, hash) {
//       if (err) return next(err);
//       // override the cleartext password with the hashed one
//       user.password = hash;
//       next();
//     });
//   });
// });

// userSchema.methods.comparePassword = function (candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(
  "users",
  userSchema,
  config.db.prefix + "users"
);
