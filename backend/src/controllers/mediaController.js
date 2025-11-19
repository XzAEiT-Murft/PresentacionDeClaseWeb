const Media = require('../models/media.js');
const Genre = require('../models/genre.js');

/* --- Helper: Nombres a IDs de Género --- */
async function getGenreIds(genreNames) {
  if (!genreNames || genreNames.length === 0) return [];
  const genres = await Genre.find({ name: { $in: genreNames } });
  return genres.map(g => g._id);
}

/* --- 1. Crear Media (Película/Serie) --- */
exports.createMedia = async (req, res) => {
  try {
    const { title, synopsis, poster_image_url, year, type, video_url, genres } = req.body;
    const genreIds = await getGenreIds(genres);

    const newMedia = new Media({
      title, synopsis, poster_image_url, year, type,
      video_url: type === 'movie' ? video_url : undefined,
      genres: genreIds
    });
    
    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* --- 2. Obtener Todo --- */
exports.getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().populate('genres'); 
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --- 3. Obtener por ID --- */
exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate('genres');
    if (!media) return res.status(404).json({ message: 'Media no encontrado' });
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --- 4. Actualizar --- */
exports.updateMedia = async (req, res) => {
  try {
    if (req.body.genres) {
      req.body.genres = await getGenreIds(req.body.genres);
    }
    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).populate('genres');
    
    if (!updatedMedia) return res.status(404).json({ message: 'Media no encontrado' });
    res.status(200).json(updatedMedia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* --- 5. Eliminar --- */
exports.deleteMedia = async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(req.params.id);
    if (!deletedMedia) return res.status(404).json({ message: 'Media no encontrado' });
    res.status(200).json({ message: 'Media eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --- 6. Carga Masiva (Batch) --- */
exports.createMediaBatch = async (req, res) => {
  try {
    const mediaData = req.body; 
    if (!Array.isArray(mediaData)) return res.status(400).json({ message: 'El body debe ser un array.' });

    const processedMedia = await Promise.all(mediaData.map(async (media) => {
      const genreIds = await getGenreIds(media.genres);
      return {
        ...media,
        genres: genreIds,
        video_url: media.type === 'movie' ? media.video_url : undefined,
      };
    }));

    const newMedia = await Media.insertMany(processedMedia);
    res.status(201).json({ message: `${newMedia.length} items creados exitosamente.` });

  } catch (error) {
    res.status(400).json({ message: 'Error en el servidor: ' + error.message });
  }
};