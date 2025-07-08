const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Ruta para agregar un estudiante
router.post("/add", studentController.addStudent);

// Ruta para asignar "examcoins"
router.post("/assign-coins", studentController.assignCoins);

// Ruta para obtener información de un estudiante
router.get("/:id", studentController.getStudent);

// Ruta para obtener la lista de estudiantes
router.get("/", studentController.getStudents);

module.exports = router;
