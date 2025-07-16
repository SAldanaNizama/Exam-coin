const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).send("Acceso denegado");

  try {
    const verified = jwt.verify(token, "tu_secreto"); 
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Token inválido");
  }
};

module.exports = auth;
