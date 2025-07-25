const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const Transaction = require("../models/Transaction");

const generateBaseEmail = (firstName, lastName) => {
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}@examcoin.pe`;
};

const generateUniqueEmail = async (firstName, lastName) => {
  let base = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  let email = `${base}@examcoin.com`;
  let count = 1;

  while (await Student.findOne({ email })) {
    email = `${base}${count}@examcoin.com`;
    count++;
  }

  return email;
};

const generateSimplePassword = () => {
  return Math.random().toString(36).slice(-6); // Ej: 'k9xw1z'
};
exports.addStudent = async (req, res) => {
  console.log("📦 Nuevo estudiante recibido:", req.body);
  try {
    const { firstName, lastName } = req.body;

    const email = await generateUniqueEmail(firstName, lastName);
    const plainPassword = generateSimplePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const student = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await student.save();

    res.status(201).json({
      message: "Estudiante creado exitosamente",
      email,
      password: plainPassword,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al agregar estudiante", error: error.message });
  }
};

exports.assignCoins = async (req, res) => {
  const { studentId, grade } = req.body;
  const coins = Math.floor(grade / 10);

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "ID de estudiante inválido" });
  }
  if (typeof grade !== "number" || grade < 0 || grade > 100) {
    return res.status(400).json({ message: "Nota inválida" });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $inc: { coins } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    // Guarda transacción por separado
    const tx = new Transaction({
      studentId,
      type: "nota",
      amount: coins,
      description: `Notas: ${grade}`,
    });
    await tx.save();

    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: "Error al asignar monedas",
      error: error.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    const updated = await Student.findByIdAndUpdate(
      id,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.json({ message: "Estudiante actualizado", student: updated });
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar estudiante",
      error: error.message,
    });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(student);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al obtener estudiante", error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.json({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(400).json({
      message: "Error al eliminar estudiante",
      error: error.message,
    });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener la lista de estudiantes",
      error: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const transactions = await Transaction.find({
      studentId: student._id,
    }).sort({ date: -1 });

    res.json(transactions); // ✅ devolvés las transacciones desde su propia colección
  } catch (error) {
    res.status(400).json({
      message: "Error al obtener historial",
      error: error.message,
    });
  }
};
