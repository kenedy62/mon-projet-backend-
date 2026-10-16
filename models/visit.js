const mongoose = require('mongoose');

const visitSchema = mongoose.Schema({
  ipAddress: { type: String, required: true }, // Pour identifier les visiteurs uniques
  userAgent: { type: String, required: true }, // Navigateur utilisé
  createdAt: { type: Date, default: Date.now }  // Date du clic
});

// Indexation automatique pour accélérer les calculs de dates
visitSchema.index({ createdAt: 1 });

module.exports = mongoose.models.Visit || mongoose.model('Visit', visitSchema);
