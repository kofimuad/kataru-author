const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  type: String,      // 'books', 'publications', etc.
  title: { type: String, required: true },
  description: String,
  coverImage: String,
  link: String,
  venue: String,
  date: String,
  year: String,
  publisher: String,
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { strict: false }); // 'strict: false' allows different fields for different sections

module.exports = mongoose.models.Content || mongoose.model('Content', ContentSchema);