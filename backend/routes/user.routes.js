const express = require('express');
const User = require('../models/User');
const Role = require('../models/Role');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.put('/:id/make-admin', verifyToken, isAdmin, async (req, res) => {
  try {
    // Uso de Promise con async/await para consultar la base de datos
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) return res.status(500).json({ message: 'Rol admin no configurado' });

    // Uso de Promise con async/await para actualizar al usuario
    const updated = await User.findByIdAndUpdate(req.params.id, { role: adminRole._id }, { new: true }).populate('role');
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Usuario promovido a admin', user: { id: updated._id, username: updated.username, roleName: updated.role.name } });
  } catch (error) {
    res.status(500).json({ message: 'Error al promover usuario', error: error.message });
  }
});

module.exports = router;
