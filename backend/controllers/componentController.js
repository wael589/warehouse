const Component = require('../models/Component');
const Reference = require('../models/Reference');
const { validationResult } = require('express-validator');

// @desc    Create new component
// @route   POST /api/components
// @access  Private (Gestionnaire, Administrateur)
exports.createComponent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { reference, indice, name, description, specifications } = req.body;

    // Check if reference exists
    const refExists = await Reference.findById(reference);
    if (!refExists) {
      return res.status(404).json({
        success: false,
        message: 'Référence non trouvée'
      });
    }

    // Check if indice already exists for this reference
    const existingComponent = await Component.findOne({ reference, indice });
    if (existingComponent) {
      return res.status(400).json({
        success: false,
        message: 'Un composant avec cet indice existe déjà pour cette référence'
      });
    }

    const component = await Component.create({
      reference,
      indice,
      name,
      description,
      specifications,
      createdBy: req.user._id
    });

    await component.populate('reference', 'referenceNumber name');
    await component.populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du composant',
      error: error.message
    });
  }
};

// @desc    Get all components for a reference
// @route   GET /api/components/reference/:referenceId
// @access  Private
exports.getComponentsByReference = async (req, res) => {
  try {
    const components = await Component.find({ reference: req.params.referenceId })
      .populate('reference', 'referenceNumber name')
      .populate('createdBy', 'username email')
      .sort({ indice: 1 });

    res.json({
      success: true,
      data: components,
      count: components.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des composants',
      error: error.message
    });
  }
};

// @desc    Get single component
// @route   GET /api/components/:id
// @access  Private
exports.getComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id)
      .populate('reference', 'referenceNumber name')
      .populate('createdBy', 'username email');

    if (!component) {
      return res.status(404).json({
        success: false,
        message: 'Composant non trouvé'
      });
    }

    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du composant',
      error: error.message
    });
  }
};

// @desc    Update component
// @route   PUT /api/components/:id
// @access  Private (Gestionnaire, Administrateur)
exports.updateComponent = async (req, res) => {
  try {
    const { name, description, specifications } = req.body;

    let component = await Component.findById(req.params.id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: 'Composant non trouvé'
      });
    }

    component = await Component.findByIdAndUpdate(
      req.params.id,
      { name, description, specifications },
      { new: true, runValidators: true }
    ).populate('reference', 'referenceNumber name')
     .populate('createdBy', 'username email');

    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du composant',
      error: error.message
    });
  }
};

// @desc    Delete component
// @route   DELETE /api/components/:id
// @access  Private (Administrateur only)
exports.deleteComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);

    if (!component) {
      return res.status(404).json({
        success: false,
        message: 'Composant non trouvé'
      });
    }

    await component.deleteOne();

    res.json({
      success: true,
      message: 'Composant supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du composant',
      error: error.message
    });
  }
};
