const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const Role = require('../models/role.js');

// --- Guardia 1: "protect" (Revisa si el boleto es válido) ---
exports.protect = async (req, res, next) => {
  let token;

  // El token vendrá en los "headers" así: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Obtener el token (sin la palabra "Bearer")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Añadimos los datos del usuario al "req"
      // para que las rutas protegidas sepan quién es
      req.user = {
        id: decoded.id,
        role: decoded.role
      };

      next(); // ¡Pase! El boleto es válido.

    } catch (error) {
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se encontró token' });
  }
};

// --- Guardia 2: "isAdmin" (Revisa si el boleto dice "admin") ---
exports.isAdmin = (req, res, next) => {
  // Este guardia se usa DESPUÉS de "protect",
  // así que ya tenemos req.user disponible.
  if (req.user && req.user.role === 'admin') {
    next(); // ¡Pase! Es admin.
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' }); // 403 = Prohibido
  }
};