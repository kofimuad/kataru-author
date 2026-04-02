const mongoose = require('mongoose');

const BioSchema = new mongoose.Schema({
  _id: { type: String, default: 'current' },
  text: String,
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'bio' }); // This matches the collection name in your URI

// This logic prevents "Cannot overwrite model once compiled" errors in Dev mode
module.exports = mongoose.models.Bio || mongoose.model('Bio', BioSchema);