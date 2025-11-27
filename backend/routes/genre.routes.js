const express = require('express');
const Genre = require('../models/Genre');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Rutas públicas
router.get('/', async (req, res) => {
  try {
    // Uso de Promise con async/await para consultar la base de datos
    const genres = await Genre.find();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener géneros', error: error.message });
  }
});

// Rutas solo admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    // Uso de Promise con async/await para guardar en la base de datos
    const genre = new Genre(req.body);
    const saved = await genre.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear género', error: error.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    // Uso de Promise con async/await para actualizar en la base de datos
    const updated = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Género no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar género', error: error.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    // Uso de Promise con async/await para eliminar en la base de datos
    const deleted = await Genre.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Género no encontrado' });
    res.json({ message: 'Género eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar género', error: error.message });
  }
});

module.exports = router;
