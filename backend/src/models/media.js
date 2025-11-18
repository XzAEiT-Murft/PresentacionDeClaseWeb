const mongoose = require('mongoose');
const { Schema } = mongoose;

const mediaSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  synopsis: {
    type: String,
    required: true
  },
  poster_image_url: { // Carátula
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  // --- ¡NUEVA LÓGICA! ---
  type: {
    type: String,
    enum: ['movie', 'series'], // Solo puede ser 'película' o 'serie'
    required: true
  },
  // --- Lógica de Película ---
  video_url: { // El MP4, solo si es 'movie'
    type: String,
    // No es 'required' porque las series no lo tienen
  },
  // --- Lógica de Serie ---
  // (Las series se conectan a los Episodios, no guardan nada aquí)
  // -------------------------
  genres: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);