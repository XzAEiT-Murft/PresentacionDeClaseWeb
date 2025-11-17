const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// --- Importar Modelos y Rutas ---
const movieRoutes = require('./src/routes/movieRoutes');
const authRoutes = require('./src/routes/authRoutes');
const Role = require('./src/models/role.js'); 

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// --- Middlewares ---
app.use(cors()); // Permite peticiones del frontend
app.use(express.json()); // Permite al servidor entender JSON

// --- Rutas de la API ---
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡El servidor Peli+ API está funcionando!');
});

// --- Función para Inicializar Roles ---
async function initializeRoles() {
  try {
    const count = await Role.countDocuments();
    if (count > 0) {
      console.log('Roles ya inicializados en la BD.');
      return;
    }

    console.log('No se encontraron roles. Creando roles por defecto...');
    await Promise.all([
      new Role({ name: 'visualizador' }).save(),
      new Role({ name: 'admin' }).save()
    ]);
    console.log('Roles [visualizador, admin] creados exitosamente.');

  } catch (error) {
    console.error('Error al inicializar roles:', error.message);
  }
}

// --- LA FUNCIÓN MÁGICA PARA ARRANCAR ---
async function startServer() {
  try {
    // 1. Conéctate a la BD y ESPERA a que termine
    await connectDB(); 

    // 2. DESPUÉS de conectar, inicializa los roles
    await initializeRoles();

    // 3. SOLO ENTONCES, empieza a escuchar peticiones
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error('Fallo al arrancar el servidor:', error.message);
    process.exit(1); // Si no nos podemos conectar a la BD, apagamos
  }
}

// --- 5. Llama a la función para arrancar todo ---
startServer();