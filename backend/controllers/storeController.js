const Student = require("../models/Student");
const Product = require("../models/Product");

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener productos", error });
  }
};

// Comprar un producto
exports.purchaseProduct = async (req, res) => {
  const { studentId, productId } = req.body;

  try {
    const student = await Student.findById(studentId);
    const product = await Product.findById(productId);

    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    if (student.coins < product.price) {
      return res.status(400).json({ message: "No tienes suficientes monedas" });
    }

    // Restar monedas al estudiante
    student.coins -= product.price;
    student.transactions.push({
      type: "compra",
      amount: product.price,
      description: `Compra de ${product.name}`,
    });
    await student.save();

    res.json({ message: "Compra exitosa", student });
  } catch (error) {
    res.status(400).json({ message: "Error al realizar la compra", error });
  }
};
