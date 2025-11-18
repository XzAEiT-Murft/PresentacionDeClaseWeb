const mongoose = require('mongoose');
const { Schema } = mongoose;

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

// El modelo se llamará 'Genre'
module.exports = mongoose.model('Genre', genreSchema);