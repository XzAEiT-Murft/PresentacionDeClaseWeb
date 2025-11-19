const mongoose = require('mongoose');
const { Schema } = mongoose;

/* --- Esquema de Códigos Temporales --- */
const verificationCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    /* --- Expiración Automática (5 min) --- */
    expires: 300 
  }
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);