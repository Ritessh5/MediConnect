const express = require('express');
const router = express.Router();
const {
  searchMedicines,
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController');
const { authenticate } = require('../middlewares/auth');

// Public routes
router.get('/search', searchMedicines);
router.get('/', getAllMedicines);
router.get('/:id', getMedicineById);

// Protected routes (Admin only - for now, just authenticate)
router.post('/', authenticate, createMedicine);
router.put('/:id', authenticate, updateMedicine);
router.delete('/:id', authenticate, deleteMedicine);

module.exports = router;
