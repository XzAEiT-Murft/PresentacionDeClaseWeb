const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Intentamos conectarnos a la BD.
    // 'process.env.DB_URI' es la URL que pusimos en docker-compose.yml
    await mongoose.connect(process.env.DB_URI);
    
    console.log('MongoDB Conectado Exitosamente (peliplus_db)');

  } catch (err) {
    // Si falla, mostramos el error y cerramos la aplicación
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1); // Detiene la app con un código de error
  }
};

module.exports = connectDB;