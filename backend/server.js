const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

/* --- Imports --- */
const mediaRoutes = require('./src/routes/mediaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const Role = require('./src/models/role.js');
const Genre = require('./src/models/genre.js'); 

dotenv.config();
const app = express();

/* --- Middlewares --- */
app.use(cors()); 
app.use(express.json()); 

/* --- Rutas --- */
app.use('/api/media', mediaRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('¡El servidor Peli+ API está funcionando!');
});

/* --- Inicializadores --- */
async function initializeRoles() {
  try {
    const count = await Role.countDocuments();
    if (count > 0) return;
    
    console.log('Creando roles por defecto...');
    await Promise.all([
      new Role({ name: 'visualizador' }).save(),
      new Role({ name: 'admin' }).save()
    ]);
    console.log('Roles creados.');
  } catch (error) {
    console.error('Error roles:', error.message);
  }
}

async function initializeGenres() {
  try {
    const count = await Genre.countDocuments();
    if (count > 0) return;
    
    console.log('Creando géneros por defecto...');
    const predefinedGenres = [
      { name: 'Acción' }, { name: 'Aventura' }, { name: 'Comedia' },
      { name: 'Crimen' }, { name: 'Drama' }, { name: 'Fantasía' },
      { name: 'Histórico' }, { name: 'Terror' }, { name: 'Misterio' },
      { name: 'Musical' }, { name: 'Romance' }, { name: 'Ciencia Ficción' },
      { name: 'Thriller' }, { name: 'Guerra' }, { name: 'Western' }
    ];
    await Genre.insertMany(predefinedGenres);
    console.log(`${predefinedGenres.length} géneros creados.`);
  } catch (error) {
    console.error('Error géneros:', error.message);
  }
}

/* --- Arranque --- */
async function startServer() {
  try {
    await connectDB(); 
    await initializeRoles(); 
    await initializeGenres(); 

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error('Fallo al arrancar:', error.message);
    process.exit(1); 
  }
}

startServer();