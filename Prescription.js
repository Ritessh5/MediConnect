const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'appointments',
      key: 'id'
    }
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'doctors',
      key: 'id'
    }
  },
  medicines: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Array of medicines with dosage and duration',
    /*
    Example structure:
    [
      {
        medicineId: "uuid",
        medicineName: "Paracetamol",
        dosage: "500mg",
        frequency: "Twice a day",
        duration: "5 days",
        instructions: "After meals"
      }
    ]
    */
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  additionalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  prescriptionFile: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to uploaded prescription PDF'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'prescriptions',
  timestamps: true
});

module.exports = Prescription;