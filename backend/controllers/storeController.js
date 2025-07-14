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
  const { studentId, productId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(studentId) ||
    !mongoose.Types.ObjectId.isValid(productId)
  ) {
    return res.status(400).json({ message: "ID inválido" });
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

    // Verificar stock si aplica
    if (product.stock <= 0) {
      return res.status(400).json({ message: "Producto agotado" });
    }

    // Descontar coins y stock
    student.coins -= product.price;
    product.stock -= 1;

    await student.save();
    await product.save();

    const tx = new Transaction({
      studentId,
      type: "compra",
      amount: product.price,
      description: `Compra de ${product.name}`,
    });
    await tx.save();

    res.json({ message: "Compra exitosa", student });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al realizar la compra", error: error.message });
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
  const { name, price, description } = req.body;

  const product = new Product({ name, price, description });
  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al agregar producto", error: error.message });
  }
};
