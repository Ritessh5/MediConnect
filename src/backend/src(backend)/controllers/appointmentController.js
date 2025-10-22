const { Appointment, Doctor, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms
    } = req.body;

    const patientId = req.userId; // From auth middleware

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if doctor is available
    if (!doctor.isAvailable) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor is not available for appointments'
      });
    }

    // Check consultation type availability
    if (consultationType === 'Video Call' && !doctor.isVideoCallAvailable) {
      return res.status(400).json({
        status: 'error',
        message: 'Video call consultation not available with this doctor'
      });
    }

    if (consultationType === 'Text Chat' && !doctor.isChatAvailable) {
      return res.status(400).json({
        status: 'error',
        message: 'Chat consultation not available with this doctor'
      });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: {
          [Op.in]: ['scheduled', 'confirmed']
        }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms,
      fee: doctor.consultationFee,
      status: 'scheduled'
    });

    // Fetch complete appointment data
    const completeAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'username', 'email', 'phone']
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'phone']
          }]
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: completeAppointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to book appointment',
      error: error.message
    });
  }
};

// @desc    Get all appointments for logged-in user
// @route   GET /api/appointments/my-appointments
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    // Check if user is a doctor
    const doctor = await Doctor.findOne({ where: { userId } });

    let appointments;
    if (doctor) {
      // Get appointments where user is the doctor
      appointments = await Appointment.findAll({
        where: {
          doctorId: doctor.id,
          ...where
        },
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'username', 'email', 'phone']
          },
          {
            model: Doctor,
            as: 'doctor',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }]
          }
        ],
        order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
      });
    } else {
      // Get appointments where user is the patient
      appointments = await Appointment.findAll({
        where: {
          patientId: userId,
          ...where
        },
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'username', 'email', 'phone']
          },
          {
            model: Doctor,
            as: 'doctor',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username']
            }]
          }
        ],
        order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
      });
    }

    res.status(200).json({
      status: 'success',
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'username', 'email', 'phone', 'gender', 'dateOfBirth']
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'phone']
          }]
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const userId = req.userId;
    const doctor = await Doctor.findOne({ where: { userId } });

    if (appointment.patientId !== userId && (!doctor || appointment.doctorId !== doctor.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      status: 'success',
      message: 'Appointment status updated',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update appointment status',
      error: error.message
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment cannot be cancelled'
      });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = cancelReason;
    appointment.cancelledBy = req.userId;
    appointment.cancelledAt = new Date();
    await appointment.save();

    res.status(200).json({
      status: 'success',
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// @desc    Add consultation notes (Doctor only)
// @route   PUT /api/appointments/:id/notes
// @access  Private (Doctor)
const addConsultationNotes = async (req, res) => {
  try {
    const { consultationNotes } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    appointment.consultationNotes = consultationNotes;
    await appointment.save();

    res.status(200).json({
      status: 'success',
      message: 'Consultation notes added',
      data: appointment
    });
  } catch (error) {
    console.error('Add notes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add consultation notes',
      error: error.message
    });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  addConsultationNotes
};
