const User = require('../models/user.js');
const Role = require('../models/role.js'); // <-- Importar Role
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <-- 1. Importar JWT

// --- Función para generar el Token ---
const generateToken = (id, roleName) => {
  return jwt.sign(
    { id: id, role: roleName }, // Lo que guardamos en el "boleto"
    process.env.JWT_SECRET,     // La clave secreta del .env
    { expiresIn: '1d' }          // El boleto expira en 1 día
  );
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 2. Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // 3. Revisar si está activo
    if (user.status !== 'active') {
      return res.status(403).json({ 
        message: 'Tu cuenta está pendiente. Por favor, verifica tu correo.' 
      });
    }

    // 4. ¡GENERAR TOKEN!
    // Buscamos el nombre del rol para guardarlo en el token
    const userRole = await Role.findById(user.role);
    const token = generateToken(user._id, userRole.name); // <-- Generamos el token

    res.status(200).json({ 
      message: 'Inicio de sesión exitoso',
      userId: user._id,
      role: userRole.name,
      token: token // <-- 5. Enviamos el token al usuario
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};