const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Uso de Promise con async/await para consultar la base de datos
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario o email ya registrados' });
    }

    const viewerRole = await Role.findOne({ name: 'viewer' });
    if (!viewerRole) {
      return res.status(500).json({ message: 'Rol viewer no configurado' });
    }

    // Uso de Promise con async/await para hashear el password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, role: viewerRole._id });
    await user.save();

    const userData = { id: user._id, username: user.username, email: user.email, role: viewerRole.name };

    res.status(201).json({ message: 'Usuario registrado', user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Error en registro', error: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Uso de Promise con async/await para consultar la base de datos
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Uso de Promise con async/await para comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Uso de JWT para generar token con Promises (async/await implícito)
    const token = jwt.sign({ id: user._id, roleId: user.role._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, roleName: user.role.name }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en login', error: error.message });
  }
});

// Obtener usuario actual
router.get('/me', verifyToken, async (req, res) => {
  try {
    // Uso de Promise con async/await para consultar la base de datos
    const user = await User.findById(req.user.id).populate('role').select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

module.exports = router;
