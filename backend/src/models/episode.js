const mongoose = require('mongoose');
const { Schema } = mongoose;

const episodeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  },
  video_url: { // El MP4 del episodio
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
  // --- La Conexión ---
  // Cada episodio "pertenece" a una serie
  mediaId: {
    type: Schema.Types.ObjectId,
    ref: 'Media', // Apunta al modelo 'Media'
    required: true
  }
});

module.exports = mongoose.model('Episode', episodeSchema);