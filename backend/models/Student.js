const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  type: { type: String, enum: ["compra", "recompensa"], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  coins: { type: Number, default: 0 },
  transactions: [transactionSchema],
});

// Nombre completo virtual
studentSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);
