const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  titre: { type: String, required: true },
  nom: { type: String, required: true },
  price: { type: Number, required: true },
  ingredient: { type: [String], required: true },
  bienfaits: { type: [String], required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imageFileId: { type: String }, // <-- Ajouté pour pouvoir supprimer l'image sur ImageKit
  userId: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  commentCount: { type: Number, default: 0 }   
});

module.exports = mongoose.models.Thing || mongoose.model('Thing', thingSchema);
