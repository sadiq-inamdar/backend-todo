const mongoose = require("mongoose");
const uuid = require("uuid");
const crypto = require("crypto");
const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  usertasks: [
    {
      type: schema.Types.ObjectId,
      ref: "tasks",
      default: []
    }
  ]
});

// virtual field (Password)
userSchema
  .virtual("password")
  .set(function(password) {
    // create temp variable _password
    this._password = password;
    //generate a timestamp
    this.salt = uuid.v1();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

const user = mongoose.model("users", userSchema);
module.exports = user;
