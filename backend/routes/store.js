const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

// Obtener todos los productos
router.get("/products", storeController.getProducts);

// Comprar un producto
router.post("/purchase", storeController.purchaseProduct);

// Agregar un nuevo producto (opcional)
router.post("/add", async (req, res) => {
  const { name, price, description } = req.body;

  const product = new Product({ name, price, description });
  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar producto", error });
  }
});

module.exports = router;
