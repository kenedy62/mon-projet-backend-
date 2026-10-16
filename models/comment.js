const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thing', required: true },
  author: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }, // 💡 NOUVEAU
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Comment', commentSchema);
