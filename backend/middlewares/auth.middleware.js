const jwt = require('jsonwebtoken');
const Role = require('../models/Role');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  // Uso de Promise con jwt.verify para validar el token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.user = { id: decoded.id, roleId: decoded.roleId };
    next();
  });
};

// Middleware para validar rol admin usando async/await (Promises)
const isAdmin = async (req, res, next) => {
  try {
    // Uso de Promise con async/await para consultar la base de datos
    const role = await Role.findById(req.user.roleId);
    if (!role || role.name !== 'admin') {
      return res.status(403).json({ message: 'Acceso solo para administradores' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error de autorización', error: error.message });
  }
};

module.exports = { verifyToken, isAdmin };
