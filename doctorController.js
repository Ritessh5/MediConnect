const { Doctor, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const { 
      specialization, 
      minFee, 
      maxFee, 
      isChatAvailable, 
      isVideoCallAvailable,
      search 
    } = req.query;

    // Build filter object
    const where = { isAvailable: true };

    if (specialization) {
      where.specialization = specialization;
    }

    if (minFee || maxFee) {
      where.consultationFee = {};
      if (minFee) where.consultationFee[Op.gte] = minFee;
      if (maxFee) where.consultationFee[Op.lte] = maxFee;
    }

    if (isChatAvailable !== undefined) {
      where.isChatAvailable = isChatAvailable === 'true';
    }

    if (isVideoCallAvailable !== undefined) {
      where.isVideoCallAvailable = isVideoCallAvailable === 'true';
    }

    const doctors = await Doctor.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'phone', 'profilePicture'],
        ...(search && {
          where: {
            username: {
              [Op.iLike]: `%${search}%`
            }
          }
        })
      }],
      order: [['rating', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'phone', 'profilePicture', 'gender', 'address']
      }]
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
};

// @desc    Create doctor profile (Admin only for now)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      specialization,
      degree,
      experience,
      consultationFee,
      bio,
      languages,
      isChatAvailable,
      isVideoCallAvailable,
      licenseNumber
    } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if doctor profile already exists for this user
    const existingDoctor = await Doctor.findOne({ where: { userId } });
    if (existingDoctor) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor profile already exists for this user'
      });
    }

    // Create doctor profile
    const doctor = await Doctor.create({
      userId,
      specialization,
      degree,
      experience,
      consultationFee,
      bio,
      languages,
      isChatAvailable,
      isVideoCallAvailable,
      licenseNumber
    });

    // Update user role to doctor
    user.role = 'doctor';
    await user.save();

    // Fetch complete doctor profile with user data
    const completeDoctor = await Doctor.findByPk(doctor.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'phone']
      }]
    });

    res.status(201).json({
      status: 'success',
      message: 'Doctor profile created successfully',
      data: completeDoctor
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create doctor profile',
      error: error.message
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Update fields
    const updatableFields = [
      'specialization', 'degree', 'experience', 'consultationFee',
      'bio', 'languages', 'isChatAvailable', 'isVideoCallAvailable',
      'isAvailable'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    await doctor.save();

    res.status(200).json({
      status: 'success',
      message: 'Doctor profile updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update doctor profile',
      error: error.message
    });
  }
};

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    await doctor.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Doctor profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete doctor profile',
      error: error.message
    });
  }
};

// @desc    Get all specializations
// @route   GET /api/doctors/specializations/list
// @access  Public
const getSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('specialization')), 'specialization']],
      raw: true
    });

    res.status(200).json({
      status: 'success',
      data: specializations.map(s => s.specialization)
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch specializations',
      error: error.message
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getSpecializations
};