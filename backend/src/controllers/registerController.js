const User = require('../models/user.js');
const Role = require('../models/role.js');
const VerificationCode = require('../models/verificationCode.js'); // <-- 1. IMPORTAR
const bcrypt = require('bcrypt');

/**
 * Genera un código de verificación aleatorio de 6 dígitos.
 */
function generateVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultRole = await Role.findOne({ name: 'visualizador' });
    if (!defaultRole) {
      return res.status(500).json({ message: 'Error: No se encontró el rol por defecto.' });
    }

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: defaultRole._id,
      status: 'pending' 
    });

    const savedUser = await newUser.save();

    // --- 2. GENERAR Y GUARDAR EL CÓDIGO ---
    const verificationCode = generateVerificationCode();

    const newCode = new VerificationCode({
      code: verificationCode,
      userId: savedUser._id
    });

    await newCode.save(); // ¡El contador de 5 min empieza AHORA!

    // 3. MOSTRAR CÓDIGO EN CONSOLA (SOLO PARA PRUEBAS)
    console.log(`--- CÓDIGO DE PRUEBA para ${savedUser.email}: ${verificationCode} ---`);
    
    res.status(201).json({ 
      message: 'Usuario registrado. Por favor, verifica tu correo.',
      userId: savedUser._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};