const mongoose = require('mongoose');
const { Schema } = mongoose;

/* --- Esquema de Géneros --- */
const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

module.exports = mongoose.model('Genre', genreSchema);