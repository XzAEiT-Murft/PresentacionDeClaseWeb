const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  // A qué usuario le pertenece este código
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // --- LA MAGIA DE LA EXPIRACIÓN ---
    // Esto crea un índice TTL. MongoDB borrará automáticamente
    // este documento después de 300 segundos (5 minutos).
    expires: 300 
  }
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);