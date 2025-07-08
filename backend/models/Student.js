// models/Student.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "notas" o "compra"
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  coins: { type: Number, default: 0 },
  transactions: [transactionSchema], // Historial de transacciones
});

module.exports = mongoose.model("Student", studentSchema);
