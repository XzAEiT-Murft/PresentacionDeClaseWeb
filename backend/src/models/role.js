const mongoose = require('mongoose');
const { Schema } = mongoose;

/* --- Esquema de Roles --- */
const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

module.exports = mongoose.model('Role', roleSchema);