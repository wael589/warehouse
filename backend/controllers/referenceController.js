const Reference = require('../models/Reference');
const Stock = require('../models/Stock');
const { validationResult } = require('express-validator');

// @desc    Create new reference
// @route   POST /api/references
// @access  Private (Gestionnaire, Administrateur)
exports.createReference = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, category } = req.body;

    const reference = await Reference.create({
      name,
      description,
      category,
      createdBy: req.user._id
    });

    // Initialize stock at 0
    await Stock.create({
      reference: reference._id,
      quantity: 0,
      lastUpdatedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: reference
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la référence',
      error: error.message
    });
  }
};

// @desc    Get all references with pagination
// @route   GET /api/references
// @access  Private
exports.getReferences = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Search filter
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { referenceNumber: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const total = await Reference.countDocuments(query);
    const references = await Reference.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: references,
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
      message: 'Erreur lors de la récupération des références',
      error: error.message
    });
  }
};

// @desc    Get single reference
// @route   GET /api/references/:id
// @access  Private
exports.getReference = async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!reference) {
      return res.status(404).json({
        success: false,
        message: 'Référence non trouvée'
      });
    }

    // Get stock info
    const stock = await Stock.findOne({ reference: reference._id })
      .populate('lastUpdatedBy', 'username');

    res.json({
      success: true,
      data: {
        ...reference.toObject(),
        stock: stock ? stock.quantity : 0,
        stockInfo: stock
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la référence',
      error: error.message
    });
  }
};

// @desc    Update reference
// @route   PUT /api/references/:id
// @access  Private (Gestionnaire, Administrateur)
exports.updateReference = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    let reference = await Reference.findById(req.params.id);

    if (!reference) {
      return res.status(404).json({
        success: false,
        message: 'Référence non trouvée'
      });
    }

    reference = await Reference.findByIdAndUpdate(
      req.params.id,
      { name, description, category },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: reference
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la référence',
      error: error.message
    });
  }
};

// @desc    Delete reference
// @route   DELETE /api/references/:id
// @access  Private (Administrateur only)
exports.deleteReference = async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id);

    if (!reference) {
      return res.status(404).json({
        success: false,
        message: 'Référence non trouvée'
      });
    }

    await reference.deleteOne();

    res.json({
      success: true,
      message: 'Référence supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la référence',
      error: error.message
    });
  }
};
