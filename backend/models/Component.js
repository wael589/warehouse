const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reference',
    required: true
  },
  indice: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  specifications: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound unique index: one reference can't have duplicate indices
componentSchema.index({ reference: 1, indice: 1 }, { unique: true });

module.exports = mongoose.model('Component', componentSchema);
