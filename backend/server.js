const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const studentRoutes = require("./routes/student");
const storeRoutes = require("./routes/store"); // Añadir ruta de tienda
const dotenv = require("dotenv");

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/students", studentRoutes);
app.use("/api/store", storeRoutes); // Añadir ruta de tienda

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
