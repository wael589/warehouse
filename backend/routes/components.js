const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createComponent,
  getComponentsByReference,
  getComponent,
  updateComponent,
  deleteComponent
} = require('../controllers/componentController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const componentValidation = [
  body('reference').notEmpty().withMessage('La référence est requise'),
  body('indice').trim().notEmpty().withMessage('L\'indice est requis'),
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('description').optional().trim(),
  body('specifications').optional().trim()
];

// Routes
router
  .route('/')
  .post(protect, authorize('administrateur', 'gestionnaire'), componentValidation, createComponent);

router
  .route('/reference/:referenceId')
  .get(protect, getComponentsByReference);

router
  .route('/:id')
  .get(protect, getComponent)
  .put(protect, authorize('administrateur', 'gestionnaire'), updateComponent)
  .delete(protect, authorize('administrateur'), deleteComponent);

module.exports = router;
