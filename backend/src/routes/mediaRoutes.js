const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController.js'); // Apunta al nuevo controlador
const { protect, isAdmin } = require('../middleware/authMiddleware.js');

// --- RUTAS PÚBLICAS ---
router.get('/', mediaController.getAllMedia);

// --- RUTAS DE ADMIN ---
router.post('/', protect, isAdmin, mediaController.createMedia);
router.post('/batch', protect, isAdmin, mediaController.createMediaBatch); // <-- ¡NUEVA RUTA!
router.put('/:id', protect, isAdmin, mediaController.updateMedia);
router.delete('/:id', protect, isAdmin, mediaController.deleteMedia);

// --- RUTA PÚBLICA (ID) ---
// Esta debe ir al final para no chocar con "batch"
router.get('/:id', mediaController.getMediaById);

module.exports = router;