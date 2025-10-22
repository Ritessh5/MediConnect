const { Chat, Message, User, Doctor, Appointment } = require('../models');
const { Op } = require('sequelize');
const { getIO } = require('../config/socket'); // Import Socket.io instance

// @desc    Create or get existing chat
// @route   POST /api/chat
// @access  Private
const createOrGetChat = async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const patientId = req.userId;

    // Check if chat already exists
    let chat = await Chat.findOne({
      where: {
        patientId,
        doctorId,
        ...(appointmentId && { appointmentId })
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'username', 'email', 'profilePicture']
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'profilePicture']
          }]
        }
      ]
    });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        patientId,
        doctorId,
        appointmentId,
        status: 'active'
      });

      // Fetch complete chat with includes
      chat = await Chat.findByPk(chat.id, {
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'username', 'email', 'profilePicture']
          },
          {
            model: Doctor,
            as: 'doctor',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'profilePicture']
            }]
          }
        ]
      });
    }

    res.status(200).json({
      status: 'success',
      data: chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create chat',
      error: error.message
    });
  }
};

// @desc    Get all chats for current user
// @route   GET /api/chat
// @access  Private
const getMyChats = async (req, res) => {
  try {
    const userId = req.userId;

    // Check if user is a doctor
    const doctor = await Doctor.findOne({ where: { userId } });

    let chats;
    if (doctor) {
      // Get chats where user is the doctor
      chats = await Chat.findAll({
        where: { doctorId: doctor.id },
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'username', 'email', 'profilePicture']
          },
          {
            model: Message,
            as: 'messages',
            limit: 1,
            order: [['createdAt', 'DESC']],
            attributes: ['message', 'createdAt', 'isRead', 'senderId'] // Include isRead and senderId
          }
        ],
        order: [['lastMessageAt', 'DESC NULLS LAST'], ['createdAt', 'DESC']]
      });
    } else {
      // Get chats where user is the patient
      chats = await Chat.findAll({
        where: { patientId: userId },
        include: [
          {
            model: Doctor,
            as: 'doctor',
            include: [{
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'profilePicture']
            }]
          },
          {
            model: Message,
            as: 'messages',
            limit: 1,
            order: [['createdAt', 'DESC']],
            attributes: ['message', 'createdAt', 'isRead', 'senderId'] // Include isRead and senderId
          }
        ],
        order: [['lastMessageAt', 'DESC NULLS LAST'], ['createdAt', 'DESC']]
      });
    }

    res.status(200).json({
      status: 'success',
      count: chats.length,
      data: chats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

// @desc    Get chat messages
// @route   GET /api/chat/:chatId/messages
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    // Verify user has access to this chat
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Chat not found'
      });
    }

    const doctor = await Doctor.findOne({ where: { userId } });
    
    if (chat.patientId !== userId && (!doctor || chat.doctorId !== doctor.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Get messages
    const messages = await Message.findAll({
      where: { chatId },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'ASC']]
    });

    // Mark messages as read and get the IDs of the messages that were marked
    const [updateCount, updatedMessages] = await Message.update(
      { isRead: true, readAt: new Date() },
      { 
        where: { 
          chatId, 
          senderId: { [Op.ne]: userId }, // Only mark messages sent by the other person
          isRead: false 
        },
        returning: true // Get the updated records
      }
    );
    
    // Notify the other user via socket that messages were read
    if (updateCount > 0) {
      try {
        const io = getIO();
        
        // --- FIX: Logic to determine the SENDER's User ID (the one who needs the blue tick) ---
        let recipientIdForSocket = null;

        if (doctor) {
            // Case 1: Current user IS the doctor (reader). The sender is the PATIENT.
            recipientIdForSocket = chat.patientId;
        } else {
            // Case 2: Current user IS the patient (reader). The sender is the DOCTOR.
            // We need the doctor's USER ID, which is stored in the Doctor model, not chat.doctorId.
            const senderDoctor = await Doctor.findByPk(chat.doctorId, {
                attributes: ['userId']
            });
            if (senderDoctor) {
                recipientIdForSocket = senderDoctor.userId;
            }
        }
        
        if (recipientIdForSocket) {
            // Emit only to the other user's personal room
            io.to(`user_${recipientIdForSocket}`).emit('messages_read', {
              chatId: chatId,
              messageIds: updatedMessages.map(msg => msg.id),
              readerId: userId // The ID of the person who just read the message
            });
        }
        
      } catch (e) {
        console.error('Socket not available/Messages read notification failed:', e.message);
      }
    }


    res.status(200).json({
      status: 'success',
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/:chatId/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const senderId = req.userId;

    // Verify chat exists and user has access
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Chat not found'
      });
    }

    const doctor = await Doctor.findOne({ where: { userId: senderId } });
    
    if (chat.patientId !== senderId && (!doctor || chat.doctorId !== doctor.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Create message
    const newMessage = await Message.create({
      chatId,
      senderId,
      message,
      messageType: 'text',
      isRead: false // New messages are unread by default
    });

    // Update chat's lastMessageAt
    chat.lastMessageAt = new Date();
    await chat.save();

    // Fetch complete message with sender info
    const completeMessage = await Message.findByPk(newMessage.id, {
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    // Emit message via Socket.io to the chat room
    try {
      const io = getIO();
      // Emit the complete message object (includes sender info)
      io.to(`chat_${chatId}`).emit('receive_message', completeMessage);

      // Emit to the recipient's personal room for notification/live chat update
      // Determine the User ID of the actual recipient (the one NOT sending the message)
      let recipientIdForNotification = null;
      
      if (chat.patientId === senderId) {
          // Sender is the patient. Recipient is the doctor.
          const recipientDoctor = await Doctor.findByPk(chat.doctorId, { attributes: ['userId'] });
          recipientIdForNotification = recipientDoctor?.userId;
      } else {
          // Sender is the doctor. Recipient is the patient.
          recipientIdForNotification = chat.patientId;
      }
      
      if (recipientIdForNotification) {
          io.to(`user_${recipientIdForNotification}`).emit('new_chat_message_notification', {
            chatId: chatId,
            senderId: senderId,
            message: completeMessage.message
          });
      }

    } catch (e) {
      console.error('Socket emission failed:', e.message);
    }
    
    // Respond to the sender's HTTP request with the saved message
    res.status(201).json({
      status: 'success',
      data: completeMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message',
      error: error.message
    });
  }
};

module.exports = {
  createOrGetChat,
  getMyChats,
  getChatMessages,
  sendMessage
};