const nodemailer = require('nodemailer');

// Configuración del transporte
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // Leemos las credenciales desde las variables de entorno (.env)
    // Esto es seguro para subir a GitHub
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"Soporte Peli+" <${process.env.EMAIL_USER}>`, // Usamos la variable aquí también
    to: to,
    subject: 'Verifica tu cuenta en Peli+',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h1 style="color: #e50914;">¡Bienvenido a Peli+!</h1>
        <p>Gracias por registrarte. Para activar tu cuenta, usa el siguiente código:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 30px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
          ${code}
        </div>
        <p style="margin-top: 20px;">Este código expira en 5 minutos.</p>
        <p style="font-size: 12px; color: #777;">Si no solicitaste este código, ignora este correo.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${to}`);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};

module.exports = { sendVerificationEmail };