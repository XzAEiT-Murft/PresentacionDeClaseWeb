const mongoose = require('mongoose'); //es la reoresentacion en la base de datos de mongose para nuestro java Script
const { Schema } = mongoose;

/* --- Esquema de Episodios (Series) --- */
const episodeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  video_url: {
    type: String,
    required: true
  },
  seasonNumber: {
    type: Number,
    required: true
  },
  episodeNumber: {
    type: Number,
    required: true
  },
  /* --- Relación con la Serie --- */
  mediaId: {
    type: Schema.Types.ObjectId,
    ref: 'Media', 
    required: true
  }
});

module.exports = mongoose.model('Episode', episodeSchema);