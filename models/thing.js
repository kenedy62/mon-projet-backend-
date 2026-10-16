const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  titre: { type: String, require: true },
  nom:{type: String, require: true},
  price: { type: Number, require: true },
  ingredient:{type: [String], require: true},
  bienfaits:{type: [String], require: true},
  description: { type: String, require: true },
  imageUrl: { type: String, require: true },
  userId: { type: String, require: true },
  rating: { type: Number, default: 4.5 },       // Note par défaut (ex: 4.5)
  commentCount: { type: Number, default: 0 }   
});

//module.exports = mongoose.model('Thing', thingSchema);
module.exports = mongoose.models.Thing || mongoose.model('Thing', thingSchema);