const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  coins: { type: Number, default: 0 },
});

// Nombre completo virtual
studentSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);
