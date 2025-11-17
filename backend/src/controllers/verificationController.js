const User = require('../models/user.js');
const VerificationCode = require('../models/verificationCode.js');

/**
 * Genera un código de verificación aleatorio de 6 dígitos.
 */
function generateVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

// --- VERIFICAR LA CUENTA ---
exports.verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Buscar el código
    const verificationCode = await VerificationCode.findOne({
      userId: user._id,
      code: code
    });

    if (!verificationCode) {
      // Código inválido o ya expiró (y fue borrado por la BD)
      return res.status(400).json({ message: 'Código de verificación inválido o expirado.' });
    }

    // ¡Éxito! Actualizamos el status del usuario
    user.status = 'active';
    await user.save();

    // Borramos el código para que no se pueda reusar
    await VerificationCode.findByIdAndDelete(verificationCode._id);

    res.status(200).json({ message: 'Cuenta verificada exitosamente. Ya puedes iniciar sesión.' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};


// --- FUNCIÓN REENVIAR EL CÓDIGO ---
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Verificar si la cuenta ya está activa
    if (user.status === 'active') {
      return res.status(400).json({ message: 'Esta cuenta ya está verificada.' });
    }

    // 1. Borrar cualquier código viejo que exista
    await VerificationCode.deleteMany({ userId: user._id });

    // 2. Generar y guardar un nuevo código
    const newCode = generateVerificationCode();
    const newVerificationCode = new VerificationCode({
      code: newCode,
      userId: user._id
    });
    await newVerificationCode.save(); // ¡Nuevo contador de 5 min!

    // 3. Mostrar en consola para pruebas
    console.log(`--- NUEVO CÓDIGO DE PRUEBA para ${user.email}: ${newCode} ---`);

    res.status(200).json({ message: 'Se ha enviado un nuevo código de verificación.' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};