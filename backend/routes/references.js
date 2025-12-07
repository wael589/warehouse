const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createReference,
  getReferences,
  getReference,
  updateReference,
  deleteReference
} = require('../controllers/referenceController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const referenceValidation = [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('description').optional().trim(),
  body('category').optional().trim()
];

// Routes
router
  .route('/')
  .get(protect, getReferences)
  .post(protect, authorize('administrateur', 'gestionnaire'), referenceValidation, createReference);

router
  .route('/:id')
  .get(protect, getReference)
  .put(protect, authorize('administrateur', 'gestionnaire'), updateReference)
  .delete(protect, authorize('administrateur'), deleteReference);

module.exports = router;
