const { sequelize } = require('../config/database');
const User = require('./User');
const Doctor = require('./Doctor');
const Medicine = require('./Medicine');
const Appointment = require('./Appointment');
const Chat = require('./Chat');
const Message = require('./Message');
const Prescription = require('./Prescription');
// Define relationships

// User <-> Doctor (One-to-One)
User.hasOne(Doctor, { 
  foreignKey: 'userId', 
  as: 'doctorProfile',
  onDelete: 'CASCADE'
});

Doctor.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user'
});

// User <-> Appointment (One-to-Many as Patient)
User.hasMany(Appointment, { 
  foreignKey: 'patientId', 
  as: 'appointments'
});

Appointment.belongsTo(User, { 
  foreignKey: 'patientId', 
  as: 'patient'
});

// Doctor <-> Appointment (One-to-Many)
Doctor.hasMany(Appointment, { 
  foreignKey: 'doctorId', 
  as: 'appointments'
});

Appointment.belongsTo(Doctor, { 
  foreignKey: 'doctorId', 
  as: 'doctor'
});

// Chat <-> Message (One-to-Many)
Chat.hasMany(Message, { 
  foreignKey: 'chatId', 
  as: 'messages' 
});

Message.belongsTo(Chat, { 
  foreignKey: 'chatId' 
});

// User <-> Chat (One-to-Many as Patient)
User.hasMany(Chat, { 
  foreignKey: 'patientId', 
  as: 'patientChats' 
});

Chat.belongsTo(User, { 
  foreignKey: 'patientId', 
  as: 'patient' 
});

// Doctor <-> Chat (One-to-Many)
Doctor.hasMany(Chat, { 
  foreignKey: 'doctorId', 
  as: 'doctorChats' 
});

Chat.belongsTo(Doctor, { 
  foreignKey: 'doctorId', 
  as: 'doctor' 
});

// Appointment <-> Chat (One-to-One)
Appointment.hasOne(Chat, { 
  foreignKey: 'appointmentId', 
  as: 'chat' 
});

Chat.belongsTo(Appointment, { 
  foreignKey: 'appointmentId', 
  as: 'appointment' 
});

// User <-> Message (One-to-Many)
User.hasMany(Message, { 
  foreignKey: 'senderId', 
  as: 'sentMessages' 
});

Message.belongsTo(User, { 
  foreignKey: 'senderId', 
  as: 'sender' 
});

// Appointment <-> Prescription (One-to-One)
Appointment.hasOne(Prescription, { foreignKey: 'appointmentId', as: 'prescription' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

// User <-> Prescription (One-to-Many as Patient)
User.hasMany(Prescription, { foreignKey: 'patientId', as: 'prescriptions' });
Prescription.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

// Doctor <-> Prescription (One-to-Many)
Doctor.hasMany(Prescription, { foreignKey: 'doctorId', as: 'prescriptions' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

// Export all models
module.exports = {
  sequelize,
  User,
  Doctor,
  Medicine,
  Appointment,
  Chat,
  Message,
  Prescription
};