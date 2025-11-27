const express = require('express');
const Movie = require('../models/Movie');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Rutas públicas
router.get('/public', async (req, res) => {
  try {
    // Uso de Promise con async/await para consultar la base de datos
    const movies = await Movie.find().populate('genres');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas', error: error.message });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    // Uso de Promise con async/await para consultar la base de datos
    const movie = await Movie.findById(req.params.id).populate('genres');
    if (!movie) return res.status(404).json({ message: 'Película no encontrada' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener película', error: error.message });
  }
});

// Ruta protegida solo para usuarios logueados
router.get('/watch/:id', verifyToken, async (req, res) => {
  try {
    // Uso de Promise con async/await para consultar la base de datos
    const movie = await Movie.findById(req.params.id).populate('genres');
    if (!movie) return res.status(404).json({ message: 'Película no encontrada' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error al reproducir', error: error.message });
  }
});

// Rutas solo admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    // Uso de Promise con async/await para guardar en la base de datos
    const movie = new Movie(req.body);
    const saved = await movie.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear película', error: error.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    // Uso de Promise con async/await para actualizar en la base de datos
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Película no encontrada' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar película', error: error.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    // Uso de Promise con async/await para eliminar en la base de datos
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Película no encontrada' });
    res.json({ message: 'Película eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar película', error: error.message });
  }
});

module.exports = router;
