const mongoose = require("mongoose");
const Student = require("../models/Student");

exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
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
      {
        $inc: { coins },
        $push: {
          transactions: {
            type: "notas",
            amount: coins,
            description: `Notas: ${grade}`,
          },
        },
      },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(student);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al asignar monedas", error: error.message });
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

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res
      .status(400)
      .json({
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
    res.json(student.transactions.reverse()); // más recientes primero
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al obtener historial", error: error.message });
  }
};
