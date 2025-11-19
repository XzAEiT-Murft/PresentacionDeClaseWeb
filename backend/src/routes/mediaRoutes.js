const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController.js');
const loginController = require('../controllers/loginController.js');
const verificationController = require('../controllers/verificationController.js');

/* --- Definición de Rutas --- */
router.post('/register', registerController.registerUser);
router.post('/login', loginController.loginUser);
router.post('/verify', verificationController.verifyUser);
router.post('/resend-code', verificationController.resendVerificationCode);

module.exports = router;