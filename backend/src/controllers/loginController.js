const User = require('../models/user.js');
const Role = require('../models/role.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* --- Generar Token JWT --- */
const generateToken = (id, roleName) => {
  return jwt.sign(
    { id: id, role: roleName },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

/* --- Lógica de Login --- */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Tu cuenta está pendiente. Por favor, verifica tu correo.'
      });
    }

    const userRole = await Role.findById(user.role);
    const token = generateToken(user._id, userRole.name);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      userId: user._id,
      role: userRole.name,
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};