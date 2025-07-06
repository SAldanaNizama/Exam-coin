const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coins: { type: Number, default: 0 },
});

module.exports = mongoose.model("Student", studentSchema);
