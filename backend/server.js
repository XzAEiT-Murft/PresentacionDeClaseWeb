const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db'); // <-- 1. Importa la conexión

// Cargar variables de entorno
dotenv.config();

// --- Conectar a la Base de Datos ---
connectDB(); // <-- 2. Llama a la función de conexión

// Inicializar Express
const app = express();

// Definir puerto
const PORT = process.env.PORT || 3000;

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡El servidor Peli+ API está funcionando!');
});

// Poner el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});