const express = require('express');
const router = express.Router();

// Importamos los 3 controladores
const registerController = require('../controllers/registerController.js');
const loginController = require('../controllers/loginController.js');
const verificationController = require('../controllers/verificationController.js');

// Ruta de Registro
// POST /api/auth/register
router.post('/register', registerController.registerUser);

// Ruta de Login
// POST /api/auth/login
router.post('/login', loginController.loginUser);

// Ruta de Verificación de Código
// POST /api/auth/verify
router.post('/verify', verificationController.verifyUser);

// --- ¡NUEVA RUTA! ---
// Ruta para Reenviar el Código
// POST /api/auth/resend-code
router.post('/resend-code', verificationController.resendVerificationCode);

module.exports = router;