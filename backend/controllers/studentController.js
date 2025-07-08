const Student = require("../models/Student");

// Agregar un nuevo estudiante
exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar estudiante", error });
  }
};

// Asignar "examcoins" a un estudiante
exports.assignCoins = async (req, res) => {
  const { studentId, grade } = req.body;
  const coins = Math.floor(grade / 10); // Lógica para asignar monedas

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
    res.status(400).json({ message: "Error al asignar monedas", error });
  }
};

// Obtener información de un estudiante
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener estudiante", error });
  }
};

// Obtener lista de estudiantes
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al obtener la lista de estudiantes", error });
  }
};
