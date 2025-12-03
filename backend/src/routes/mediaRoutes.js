const express = require('express');
const router = express.Router();

// Importamos el controlador CORRECTO para las películas
const mediaController = require('../controllers/mediaController'); 

// GET /api/media -> Obtener todas las películas (para la tabla)
router.get('/', mediaController.getAllMedia);

// POST /api/media -> Crear una nueva película (para tu formulario)
router.post('/', mediaController.createMedia);

// PUT /api/media/:id -> Actualizar una película
router.put('/:id', mediaController.updateMedia);

// DELETE /api/media/:id -> Eliminar una película
router.delete('/:id', mediaController.deleteMedia);

// GET /api/media/:id -> Ver detalle de una sola
router.get('/:id', mediaController.getMediaById);

module.exports = router;