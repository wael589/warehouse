const Stock = require('../models/Stock');
const StockMovement = require('../models/StockMovement');
const Reference = require('../models/Reference');
const { validationResult } = require('express-validator');

// @desc    Set initial stock quantity
// @route   POST /api/stock/init
// @access  Private (Gestionnaire, Administrateur)
exports.initializeStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { reference, quantity } = req.body;

    // Check if reference exists
    const refExists = await Reference.findById(reference);
    if (!refExists) {
      return res.status(404).json({
        success: false,
        message: 'Référence non trouvée'
      });
    }

    let stock = await Stock.findOne({ reference });

    if (!stock) {
      stock = await Stock.create({
        reference,
        quantity,
        lastUpdatedBy: req.user._id
      });
    } else {
      const previousQuantity = stock.quantity;
      stock.quantity = quantity;
      stock.lastUpdatedBy = req.user._id;
      await stock.save();

      // Record movement
      await StockMovement.create({
        reference,
        type: 'INIT',
        quantity,
        previousQuantity,
        newQuantity: quantity,
        reason: 'Initialisation du stock',
        createdBy: req.user._id
      });
    }

    await stock.populate('reference', 'referenceNumber name');

    res.status(201).json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'initialisation du stock',
      error: error.message
    });
  }
};

// @desc    Add stock
// @route   POST /api/stock/add
// @access  Private (Magasinier, Gestionnaire, Administrateur)
exports.addStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { reference, quantity, reason } = req.body;

    // Check if reference exists
    const refExists = await Reference.findById(reference);
    if (!refExists) {
      return res.status(404).json({
        success: false,
        message: 'Référence non trouvée'
      });
    }

    let stock = await Stock.findOne({ reference });

    if (!stock) {
      stock = await Stock.create({
        reference,
        quantity,
        lastUpdatedBy: req.user._id
      });
    } else {
      const previousQuantity = stock.quantity;
      stock.quantity += quantity;
      stock.lastUpdatedBy = req.user._id;
      await stock.save();

      // Record movement
      await StockMovement.create({
        reference,
        type: 'IN',
        quantity,
        previousQuantity,
        newQuantity: stock.quantity,
        reason,
        createdBy: req.user._id
      });
    }

    await stock.populate('reference', 'referenceNumber name');

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du stock',
      error: error.message
    });
  }
};

// @desc    Remove stock
// @route   POST /api/stock/remove
// @access  Private (Magasinier, Gestionnaire, Administrateur)
exports.removeStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { reference, quantity, reason } = req.body;

    // Check if reference exists
    const refExists = await Reference.findById(reference);
    if (!refExists) {
      return res.status(404).json({
        success: false,
        message: 'Référence non trouvée'
      });
    }

    let stock = await Stock.findOne({ reference });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock non trouvé pour cette référence'
      });
    }

    if (stock.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Quantité insuffisante en stock'
      });
    }

    const previousQuantity = stock.quantity;
    stock.quantity -= quantity;
    stock.lastUpdatedBy = req.user._id;
    await stock.save();

    // Record movement
    await StockMovement.create({
      reference,
      type: 'OUT',
      quantity,
      previousQuantity,
      newQuantity: stock.quantity,
      reason,
      createdBy: req.user._id
    });

    await stock.populate('reference', 'referenceNumber name');

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait du stock',
      error: error.message
    });
  }
};

// @desc    Get stock for a reference
// @route   GET /api/stock/reference/:referenceId
// @access  Private
exports.getStockByReference = async (req, res) => {
  try {
    const stock = await Stock.findOne({ reference: req.params.referenceId })
      .populate('reference', 'referenceNumber name category')
      .populate('lastUpdatedBy', 'username');

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock non trouvé pour cette référence'
      });
    }

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du stock',
      error: error.message
    });
  }
};

// @desc    Get all stocks
// @route   GET /api/stock
// @access  Private
exports.getAllStocks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Stock.countDocuments();
    const stocks = await Stock.find()
      .populate('reference', 'referenceNumber name category')
      .populate('lastUpdatedBy', 'username')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: stocks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des stocks',
      error: error.message
    });
  }
};

// @desc    Get stock movements for a reference
// @route   GET /api/stock/movements/:referenceId
// @access  Private
exports.getStockMovements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { reference: req.params.referenceId };

    const total = await StockMovement.countDocuments(query);
    const movements = await StockMovement.find(query)
      .populate('reference', 'referenceNumber name')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: movements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des mouvements',
      error: error.message
    });
  }
};
