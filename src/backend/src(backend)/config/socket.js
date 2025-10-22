const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);
    
    // Notify user is online
    socket.broadcast.emit('user_online', { userId: socket.userId });

    // Chat events
    socket.on('join_chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // NOTE: The 'send_message' socket event is handled by the chatController
    // after the message is saved to the DB. The frontend calls the HTTP API
    // which then triggers the server-side socket emission. 
    /*
    socket.on('send_message', async (data) => {
      // This is now redundant and should be handled by the controller
      // to ensure the message is persisted before being emitted.
      // ...
    });
    */

    socket.on('typing', (data) => {
      // Emit to all users in the chat room *except* the sender
      socket.to(`chat_${data.chatId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    // Video call events
    socket.on('call_user', (data) => {
      io.to(`user_${data.to}`).emit('incoming_call', {
        from: socket.userId,
        offer: data.offer,
        roomId: data.roomId
      });
    });

    socket.on('answer_call', (data) => {
      io.to(`user_${data.to}`).emit('call_answered', {
        from: socket.userId,
        answer: data.answer
      });
    });

    socket.on('ice_candidate', (data) => {
      io.to(`user_${data.to}`).emit('ice_candidate', {
        candidate: data.candidate,
        from: socket.userId
      });
    });

    socket.on('end_call', (data) => {
      io.to(`user_${data.to}`).emit('call_ended', {
        from: socket.userId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      // Notify user is offline (optional)
      socket.broadcast.emit('user_offline', { userId: socket.userId });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
