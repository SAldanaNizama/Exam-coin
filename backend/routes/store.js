const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const auth = require("../middleware/auth");

// Ver tienda (puede ser público o protegido con login básico)
router.get("/products", storeController.getProducts);

// Agregar producto (solo admin)
router.post("/products", auth("admin"), storeController.addProduct);

// Editar producto (nombre, precio, descripción, stock)
router.put("/products/:id", auth("admin"), storeController.updateProduct);

// Eliminar producto (solo admin)
router.delete("/products/:id", auth("admin"), storeController.deleteProduct);

// Comprar producto (solo estudiante logueado)
router.post("/purchase", auth("student"), storeController.purchaseProduct);

module.exports = router;
