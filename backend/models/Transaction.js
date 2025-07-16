const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  type: {
    type: String,
    enum: ["compra", "recompensa", "nota"],
    required: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
