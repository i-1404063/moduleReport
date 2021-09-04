const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email is requied!",
  },
  phone: String,
  userCode: String,
});

module.exports = mongoose.model("User", userSchema);
