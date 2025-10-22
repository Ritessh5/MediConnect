// Fixed Medicine Controller with proper symptom search
// Location: src/backend/src/controllers/medicineController.js

const { Medicine } = require('../models');
const { Op } = require('sequelize');

/**
 * Enhanced search medicines - FIXED symptom search
 * GET /api/medicines/search?query=fever&type=symptom
 */
exports.searchMedicines = async (req, res) => {
  try {
    const { query, type = 'name' } = req.query;

    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
        count: 0,
        data: []
      });
    }

    let searchCondition = {};
    const searchTerm = query.toLowerCase().trim();

    // Added a minimal validation check for the term itself
    if (searchTerm.length === 0) {
       return res.status(400).json({
        status: 'error',
        message: 'Search term cannot be empty',
        count: 0,
        data: []
      });
    }

    switch (type) {
      case 'name':
        // Search by medicine name or alternative name
        searchCondition = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchTerm}%` } },
            { alternativeName: { [Op.iLike]: `%${searchTerm}%` } }
          ]
        };
        break;

      case 'symptom':
        // NOTE: This logic relies on your PostgreSQL database and 
        // Sequelize model using the native ARRAY type.
        searchCondition = {
          [Op.or]: [
            // Search in symptoms array (case-insensitive check for element containment)
            { symptoms: { [Op.overlap]: [searchTerm] } },
            // Search in treats array (include capitalized version for broader match)
            { treats: { [Op.overlap]: [searchTerm, searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)] } },
            // Search in description as fallback
            { description: { [Op.iLike]: `%${searchTerm}%` } }
          ]
        };
        break;

      case 'disease':
        // Search by treats array or description
        searchCondition = {
          [Op.or]: [
            { treats: { [Op.overlap]: [searchTerm, searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)] } },
            { description: { [Op.iLike]: `%${searchTerm}%` } }
          ]
        };
        break;

      case 'ingredient':
        // Search by composition/active ingredient
        searchCondition = {
          composition: { [Op.iLike]: `%${searchTerm}%` }
        };
        break;

      default:
        // Default to comprehensive search
        searchCondition = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchTerm}%` } },
            { alternativeName: { [Op.iLike]: `%${searchTerm}%` } },
            { composition: { [Op.iLike]: `%${searchTerm}%` } },
            { description: { [Op.iLike]: `%${searchTerm}%` } }
          ]
        };
    }

    console.log('Search Type:', type);
    console.log('Search Term:', searchTerm);
    console.log('Search Condition:', JSON.stringify(searchCondition, null, 2));

    const medicines = await Medicine.findAll({
      where: searchCondition,
      // FIX FOR DUPLICATES: Use the group option to ensure only unique rows are returned.
      group: ['Medicine.id'], 
      limit: 50,
      order: [['name', 'ASC']]
    });

    console.log('Found medicines:', medicines.length);

    res.json({
      status: 'success',
      count: medicines.length,
      searchType: type,
      searchQuery: query,
      data: medicines
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search medicines',
      count: 0,
      data: [],
      error: error.message
    });
  }
};

/**
 * Get all medicines with pagination
 * GET /api/medicines?page=1&limit=20
 */
exports.getAllMedicines = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Medicine.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      status: 'success',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch medicines',
      error: error.message
    });
  }
};

/**
 * Get medicine by ID
 * GET /api/medicines/:id
 */
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: 'error',
        message: 'Medicine not found'
      });
    }

    res.json({
      status: 'success',
      data: medicine
    });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch medicine',
      error: error.message
    });
  }
};

/**
 * Create new medicine
 * POST /api/medicines
 */
exports.createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Medicine created successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create medicine',
      error: error.message
    });
  }
};

/**
 * Update medicine
 * PUT /api/medicines/:id
 */
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: 'error',
        message: 'Medicine not found'
      });
    }

    await medicine.update(req.body);

    res.json({
      status: 'success',
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(400).json({
      status: 'error',
      message: 'Failed to update medicine',
      error: error.message
    });
  }
};

/**
 * Delete medicine
 * DELETE /api/medicines/:id
 */
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        status: 'error',
        message: 'Medicine not found'
      });
    }

    await medicine.destroy();

    res.json({
      status: 'success',
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete medicine',
      error: error.message
    });
  }
};