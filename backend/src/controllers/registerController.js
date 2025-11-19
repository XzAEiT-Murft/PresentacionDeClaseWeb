const User = require('../models/user.js');
const Role = require('../models/role.js');
const VerificationCode = require('../models/verificationCode.js');
const { sendVerificationEmail } = require('../utils/emailService');
const bcrypt = require('bcrypt');

/* --- Generador de Códigos --- */
function generateVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/* --- Lógica de Registro --- */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validar existencia
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
    }

    // 2. Encriptar password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Asignar rol por defecto
    const defaultRole = await Role.findOne({ name: 'visualizador' });
    if (!defaultRole) {
      return res.status(500).json({ message: 'Error: No se encontró el rol por defecto.' });
    }

    // 4. Crear usuario
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: defaultRole._id,
      status: 'pending'
    });

    const savedUser = await newUser.save();

    // 5. Generar y enviar código
    const verificationCode = generateVerificationCode();
    const newCode = new VerificationCode({
      code: verificationCode,
      userId: savedUser._id
    });
    await newCode.save();

    // Enviar email real (sin console.log del código)
    await sendVerificationEmail(savedUser.email, verificationCode);

    res.status(201).json({
      message: 'Usuario registrado. Revisa tu bandeja de entrada.',
      userId: savedUser._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};