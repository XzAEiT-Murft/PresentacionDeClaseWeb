const mongoose = require('mongoose');

/* --- Conexión a MongoDB --- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('MongoDB Conectado Exitosamente (peliplus_db)');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;