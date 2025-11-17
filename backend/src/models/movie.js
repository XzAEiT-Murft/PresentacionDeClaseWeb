const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  director: {
    type: String,
    required: true,
    trim: true
  },
  synopsis: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  poster_image_url: { // <-- El enlace a la IMAGEN
    type: String,
    required: true
  },
  video_url: {        // <-- ¡NUEVO! El enlace al VIDEO
    type: String,
    required: true
  },
  genres: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);