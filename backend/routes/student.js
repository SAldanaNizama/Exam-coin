const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const auth = require("../middleware/auth");

// 🔐 Solo admins pueden crear estudiantes
router.post("/", auth("admin"), studentController.addStudent);

// 🔐 Solo admins asignan monedas
router.post("/assign-coins", auth("admin"), studentController.assignCoins);

// ✅ Un estudiante puede ver solo su perfil (o el frontend controla esto)
router.get("/:id", auth(["student", "admin"]), studentController.getStudent);

//✅ Editar estudiantes

router.put("/:id", auth("admin"), studentController.updateStudent);
// ✅ Un estudiante puede ver su propio historial
router.get(
  "/:id/transactions",
  auth(["student", "admin"]),
  studentController.getTransactions
);

//✅Eliminar estudiante
router.delete("/:id", auth("admin"), studentController.deleteStudent);


// 🔐 Solo admins pueden ver todos los estudiantes
router.get("/", auth("admin"), studentController.getStudents);

module.exports = router;
