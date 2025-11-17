// Archivo: backend/src/routes/movieRoutes.js

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController.js');

// Importamos a nuestros guardias
const { protect, isAdmin } = require('../middleware/authMiddleware.js');

// ---
// RUTAS PÚBLICAS (Cualquiera puede verlas, no se necesita token)
// ---
router.get('/', movieController.getAllMovies);         // <-- ¡YA NO TIENE "protect"!
router.get('/:id', movieController.getMovieById);      // <-- ¡YA NO TIENE "protect"!


// ---
// RUTAS SOLO PARA "ADMIN" (Requieren token de admin)
// ---
// Usamos "protect" Y LUEGO "isAdmin"
router.post('/', protect, isAdmin, movieController.createMovie);
router.put('/:id', protect, isAdmin, movieController.updateMovie);
router.delete('/:id', protect, isAdmin, movieController.deleteMovie);

module.exports = router;