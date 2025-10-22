const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getSpecializations
} = require('../controllers/doctorController');
const { authenticate } = require('../middlewares/auth');

// Public routes
router.get('/', getAllDoctors);
router.get('/specializations/list', getSpecializations);
router.get('/:id', getDoctorById);

// Protected routes
router.post('/', authenticate, createDoctor);
router.put('/:id', authenticate, updateDoctor);
router.delete('/:id', authenticate, deleteDoctor);

module.exports = router;
