const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  coins: { type: Number, default: 0 },
  role: { type: String, enum: ["student", "admin"], default: "student" }, // <- AÑADIR ESTA LÍNEA
});

// Nombre completo virtual
studentSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Opcional: ocultar password en JSON
studentSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});
studentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);
