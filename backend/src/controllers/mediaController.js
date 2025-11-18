const Media = require('../models/media.js');
const Genre = require('../models/genre.js'); // Importamos Genre

// --- Función Helper (Ayudante) ---
// Convierte un array de nombres de género ["Drama", "Crimen"]
// en un array de IDs ["691d...", "691d..."]
async function getGenreIds(genreNames) {
  if (!genreNames || genreNames.length === 0) {
    return [];
  }
  
  // Busca todos los géneros que coincidan con los nombres
  const genres = await Genre.find({ name: { $in: genreNames } });
  
  // Devuelve solo sus IDs
  return genres.map(g => g._id);
}

// --- 1. CREAR un "Media" (Película o Serie) ---
exports.createMedia = async (req, res) => {
  try {
    const { title, synopsis, poster_image_url, year, type, video_url, genres } = req.body;

    // ¡ARREGLO DE GÉNEROS!
    // Convertimos los nombres de género en IDs
    const genreIds = await getGenreIds(genres);

    const newMedia = new Media({
      title,
      synopsis,
      poster_image_url,
      year,
      type,
      video_url: type === 'movie' ? video_url : undefined, // Solo guarda video_url si es 'movie'
      genres: genreIds // Guarda el array de IDs
    });
    
    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- 2. LEER todos los "Media" ---
exports.getAllMedia = async (req, res) => {
  try {
    // ¡ARREGLO DE 'populate'!
    // .populate('genres') le dice a Mongoose:
    // "Busca los IDs en el campo 'genres' y reemplázalos
    // con el documento completo del género (nombre, id, etc.)"
    const media = await Media.find().populate('genres'); 
    
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. LEER un solo "Media" por ID ---
exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate('genres');
    if (!media) {
      return res.status(404).json({ message: 'Media no encontrado' });
    }
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 4. ACTUALIZAR un "Media" ---
exports.updateMedia = async (req, res) => {
  try {
    // Si el admin está actualizando los géneros, también convertimos los nombres
    if (req.body.genres) {
      req.body.genres = await getGenreIds(req.body.genres);
    }

    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Devuelve el documento actualizado
    ).populate('genres');
    
    if (!updatedMedia) {
      return res.status(404).json({ message: 'Media no encontrado' });
    }
    res.status(200).json(updatedMedia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- 5. BORRAR un "Media" ---
exports.deleteMedia = async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(req.params.id);
    if (!deletedMedia) {
      return res.status(404).json({ message: 'Media no encontrado' });
    }
    // (Lógica futura: si es una serie, también borrar sus episodios)
    res.status(200).json({ message: 'Media eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 6. CREAR MÚLTIPLES "Media" (Batch/Seed) ---
exports.createMediaBatch = async (req, res) => {
  try {
    // req.body ahora es un ARRAY de películas [ {...}, {...} ]
    const mediaData = req.body; 
    
    if (!Array.isArray(mediaData)) {
      return res.status(400).json({ message: 'El body debe ser un array de "media".' });
    }

    // 1. Convertir todos los nombres de género a IDs
    //    Usamos "Promise.all" para hacer esto en paralelo (¡más rápido!)
    const processedMedia = await Promise.all(mediaData.map(async (media) => {
      const genreIds = await getGenreIds(media.genres); // Reutilizamos nuestra función helper
      
      return {
        ...media, // Copia todos los campos (title, synopsis, etc.)
        genres: genreIds, // Sobrescribe 'genres' con los IDs
        video_url: media.type === 'movie' ? media.video_url : undefined,
      };
    }));

    // 2. Insertar todos los documentos procesados de golpe
    const newMedia = await Media.insertMany(processedMedia);

    res.status(201).json({ message: `${newMedia.length} items creados exitosamente.` });

  } catch (error) {
    res.status(400).json({ message: 'Error en el servidor: ' + error.message });
  }
};