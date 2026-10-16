const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Sécurité pour ne pas recompiler si le modèle existe déjà
module.exports = mongoose.models.UserPub || mongoose.model('UserPub', userSchema);
