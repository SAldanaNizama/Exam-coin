const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

// Obtener todos los productos
router.get("/products", storeController.getProducts);

// Agregar un nuevo producto
router.post("/products", storeController.addProduct);

// Eliminar un producto
router.delete("/products/:id", storeController.deleteProduct);

// Comprar un producto
router.post("/purchase", storeController.purchaseProduct);

module.exports = router;
