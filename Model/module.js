const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  completedModuleName: [String],
  totalMark: Number,
  correctMark: Number,
});

module.exports = mongoose.model("Module", moduleSchema);
