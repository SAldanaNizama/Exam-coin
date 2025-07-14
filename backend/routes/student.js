const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Crear estudiante
router.post("/", studentController.addStudent);

// Asignar monedas
router.post("/assign-coins", studentController.assignCoins);

// Obtener un estudiante
router.get("/:id", studentController.getStudent);

// Obtener historial de transacciones (opcional)
router.get("/:id/transactions", studentController.getTransactions);

// Obtener todos los estudiantes
router.get("/", studentController.getStudents);

module.exports = router;
