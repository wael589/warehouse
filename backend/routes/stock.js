const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  initializeStock,
  addStock,
  removeStock,
  getStockByReference,
  getAllStocks,
  getStockMovements
} = require('../controllers/stockController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const stockValidation = [
  body('reference').notEmpty().withMessage('La référence est requise'),
  body('quantity').isInt({ min: 0 }).withMessage('La quantité doit être un nombre positif'),
  body('reason').optional().trim()
];

// Routes
router.get('/', protect, getAllStocks);

router.post(
  '/init',
  protect,
  authorize('administrateur', 'gestionnaire'),
  stockValidation,
  initializeStock
);

router.post(
  '/add',
  protect,
  authorize('administrateur', 'gestionnaire', 'magasinier'),
  stockValidation,
  addStock
);

router.post(
  '/remove',
  protect,
  authorize('administrateur', 'gestionnaire', 'magasinier'),
  stockValidation,
  removeStock
);

router.get('/reference/:referenceId', protect, getStockByReference);
router.get('/movements/:referenceId', protect, getStockMovements);

module.exports = router;
