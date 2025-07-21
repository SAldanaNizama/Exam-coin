const mongoose = require("mongoose");
const Student = require("../models/Student");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al obtener productos", error: error.message });
  }
};

exports.purchaseProduct = async (req, res) => {
  const studentId = req.user.id; // viene del token
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "ID de producto inválido" });
  }

  try {
    const student = await Student.findById(studentId);
    const product = await Product.findById(productId);

    if (!student)
      return res.status(404).json({ message: "Estudiante no encontrado" });
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    if (student.coins < product.price) {
      return res.status(400).json({ message: "No tienes suficientes monedas" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Producto agotado" });
    }

    // Actualiza monedas y stock
    student.coins -= product.price;
    product.stock -= 1;

    await student.save();
    await product.save();

    // Guarda transacción
    const tx = new Transaction({
      studentId,
      type: "compra",
      amount: product.price,
      description: `Compra de ${product.name}`,
    });
    await tx.save();

    res.json({ message: "Compra exitosa", student, product, transaction: tx });
  } catch (error) {
    console.error("❌ Error en el backend al comprar:", error);
    res.status(400).json({
      message: error.message || "Error al realizar la compra",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(stock && { stock: Number(stock) }),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado", product: updatedProduct });
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al eliminar producto", error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    console.log("Producto recibido:", req.body);
    const product = new Product({
      name,
      price: Number(price),
      description,
      stock: Number(stock), // 👈 Asegúrate que sea un número
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: "Error al agregar producto",
      error: error.message,
    });
  }
};
