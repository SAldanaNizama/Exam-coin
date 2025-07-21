const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const studentRoutes = require("./routes/student");
const storeRoutes = require("./routes/store");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Middleware de logging (opcional)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/store", storeRoutes);

// Manejo de errores generales (opcional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
