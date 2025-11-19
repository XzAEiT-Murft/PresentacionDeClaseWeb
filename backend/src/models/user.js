const mongoose = require('mongoose');
const { Schema } = mongoose;

/* --- Esquema de Usuario --- */
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active'], 
    default: 'pending'
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  
  /* --- Lista de Favoritos --- */
  myList: [{
    type: Schema.Types.ObjectId,
    ref: 'Media' 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);