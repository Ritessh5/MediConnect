const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  addConsultationNotes
} = require('../controllers/appointmentController');
const { authenticate } = require('../middlewares/auth');

// All routes are protected (require authentication)
router.use(authenticate);

// Appointment routes
router.post('/', bookAppointment);
router.get('/my-appointments', getMyAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/status', updateAppointmentStatus);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/notes', addConsultationNotes);

module.exports = router;
