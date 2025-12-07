const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  referenceNumber: {
    type: String,
    unique: true,
    required: true
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
  category: {
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

// Auto-generate reference number
referenceSchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const count = await mongoose.model('Reference').countDocuments();
    this.referenceNumber = `REF-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Reference', referenceSchema);
