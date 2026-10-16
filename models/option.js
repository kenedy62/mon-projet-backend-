const mongoose = require('mongoose');

// Schéma générique réutilisable pour les Ingrédients et les Bienfaits
const optionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['ingredient', 'bienfait'] } // Permet de trier le type de donnée
});

module.exports = mongoose.models.Option || mongoose.model('Option', optionSchema);
