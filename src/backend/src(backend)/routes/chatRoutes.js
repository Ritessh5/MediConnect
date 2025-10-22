const express = require('express');
const router = express.Router();
const {
  createOrGetChat,
  getMyChats,
  getChatMessages,
  sendMessage
} = require('../controllers/chatController');
const { authenticate } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

router.post('/', createOrGetChat);
router.get('/', getMyChats);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
