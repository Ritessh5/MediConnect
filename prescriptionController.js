const { Prescription, Appointment, User, Doctor, Medicine } = require('../models');

// Create prescription
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, additionalNotes, followUpDate } = req.body;
    
    // Verify appointment and doctor access
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    // Create prescription
    const prescription = await Prescription.create({
      appointmentId,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      medicines,
      diagnosis,
      additionalNotes,
      followUpDate
    });

    res.status(201).json({
      status: 'success',
      message: 'Prescription created successfully',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create prescription' });
  }
};

// Get patient's prescriptions
const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { patientId: req.userId },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{ model: User, as: 'user', attributes: ['username'] }]
        },
        { model: Appointment, as: 'appointment' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ status: 'success', count: prescriptions.length, data: prescriptions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch prescriptions' });
  }
};

module.exports = { createPrescription, getMyPrescriptions };