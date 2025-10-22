const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const {
  validateRegister,
  validateLogin,
  validatePasswordChange
} = require('../middlewares/validation');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.put('/change-password', authenticate, validatePasswordChange, changePassword);

module.exports = router;