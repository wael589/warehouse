const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reference',
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stock', stockSchema);
