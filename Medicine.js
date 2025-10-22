const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Medicine = sequelize.define('Medicine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alternativeName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  composition: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treats: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  symptoms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  forms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  dosage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sideEffects: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precautions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isOTC: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Over The Counter medicine'
  },
  isPrescriptionRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'medicines',
  timestamps: true
});

module.exports = Medicine;