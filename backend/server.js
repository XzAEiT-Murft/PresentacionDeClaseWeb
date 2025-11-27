const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// Modelos para seed inicial
const Role = require('./models/Role');
const Genre = require('./models/Genre');

// Rutas
const authRoutes = require('./routes/auth.routes');
const movieRoutes = require('./routes/movie.routes');
const genreRoutes = require('./routes/genre.routes');
const userRoutes = require('./routes/user.routes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Seed de roles
async function initializeRoles() {
  try {
    const count = await Role.countDocuments();
    if (count > 0) return;

    console.log('Creando roles por defecto...');
    await Role.insertMany([{ name: 'viewer' }, { name: 'admin' }]);
    console.log('Roles creados.');
  } catch (error) {
    console.error('Error roles:', error.message);
  }
}

// Seed de géneros
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

// Arranque
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
