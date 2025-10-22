const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: true,
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
  status: {
    type: DataTypes.ENUM('active', 'closed', 'archived'),
    defaultValue: 'active'
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'chats',
  timestamps: true
});

module.exports = Chat;
