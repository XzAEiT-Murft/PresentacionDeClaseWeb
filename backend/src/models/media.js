const mongoose = require('mongoose');
const { Schema } = mongoose;

/* --- Esquema de Películas y Series --- */
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
  poster_image_url: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'series'], 
    required: true
  },
  /* --- Solo para Películas --- */
  video_url: { 
    type: String,
  },
  
  /* --- Relaciones --- */
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