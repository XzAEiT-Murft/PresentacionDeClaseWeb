const User = require('../models/user.js');
const VerificationCode = require('../models/verificationCode.js');
const { sendVerificationEmail } = require('../utils/emailService'); 

/* --- Generador de Códigos --- */
function generateVerificationCode() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/* --- Verificar Código --- */
exports.verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const verificationCode = await VerificationCode.findOne({
      userId: user._id,
      code: code
    });

    if (!verificationCode) {
      return res.status(400).json({ message: 'Código de verificación inválido o expirado.' });
    }

    user.status = 'active';
    await user.save();

    await VerificationCode.findByIdAndDelete(verificationCode._id);

    res.status(200).json({ message: 'Cuenta verificada exitosamente. Ya puedes iniciar sesión.' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};

/* --- Reenviar Código --- */
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (user.status === 'active') {
      return res.status(400).json({ message: 'Esta cuenta ya está verificada.' });
    }

    await VerificationCode.deleteMany({ userId: user._id });

    const newCode = generateVerificationCode();
    const newVerificationCode = new VerificationCode({
      code: newCode,
      userId: user._id
    });
    await newVerificationCode.save();

    // Enviar email con el nuevo código
    await sendVerificationEmail(user.email, newCode);

    res.status(200).json({ message: 'Se ha enviado un nuevo código de verificación.' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor: ' + error.message });
  }
};