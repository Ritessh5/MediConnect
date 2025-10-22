import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { chatAPI } from '@api/api.js';
import io from 'socket.io-client';
import './App.css';

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const chatId = searchParams.get('chatId');
  
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // NOTE: The socket URL should match your backend server (e.g., http://localhost:5000)
  const SOCKET_URL = 'http://localhost:5000'; 
  
  useEffect(() => {
    // 1. Authentication Check and User Setup
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('accessToken');
    
    if (!user || !token) {
        console.error('Authentication failed: Missing user or token.');
        alert('Authentication required. Redirecting to login.');
        navigate('/auth'); 
        return;
    }

    // Set user and proceed with chat loading
    setCurrentUser(user);
    
    // 2. Chat Initialization Logic
    const init = async () => {
        if (chatId) {
            await loadExistingChat(chatId);
        } else if (doctorId) {
            await initializeChat();
        } else {
            navigate('/my-chats');
        }
    };
    init();

    return () => {
      // 3. Cleanup on component unmount
      if (socketRef.current) {
        if (chat && chat.id) {
             socketRef.current.emit('leave_chat', chat.id);
        }
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, chatId, navigate]); 

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Helper function to force the read status update on the current chat.
   * This triggers the backend to update DB and emit 'messages_read' to the sender.
   */
  const triggerReadUpdate = (id) => {
    // CRITICAL FIX: Add timeout to ensure the socket is fully connected and joined the room
    setTimeout(() => {
        chatAPI.getChatMessages(id).catch(console.error);
    }, 500); 
  };


  const loadExistingChat = async (existingChatId) => {
    try {
      setLoading(true);
      
      // Get chat details first
      const chatsResponse = await chatAPI.getMyChats();
      const foundChat = chatsResponse.data.find(c => c.id === existingChatId);
      
      if (!foundChat) {
        alert('Chat not found');
        navigate('/my-chats');
        return;
      }
      
      setChat(foundChat);
      
      // Get messages for existing chat (also marks them as read on the backend)
      const messagesResponse = await chatAPI.getChatMessages(existingChatId);
      setMessages(messagesResponse.data);
      
      // Initialize Socket.io
      initializeSocket(existingChatId);
      
      // FIX APPLICATION: Trigger read update on load to get the blue tick for the sender
      triggerReadUpdate(existingChatId);

    } catch (error) {
      console.error('Load chat error:', error);
      alert('Failed to load chat details. Please try again.');
      navigate('/my-chats');
    } finally {
      setLoading(false);
    }
  };

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      // Create or get existing chat
      const chatResponse = await chatAPI.createOrGetChat(doctorId);
      const newChatId = chatResponse.data.id;
      
      setChat(chatResponse.data);
      
      // Get messages
      const messagesResponse = await chatAPI.getChatMessages(newChatId);
      setMessages(messagesResponse.data);
      
      // Initialize Socket.io
      initializeSocket(newChatId);

      // FIX APPLICATION: Trigger read update on load to get the blue tick for the sender
      triggerReadUpdate(newChatId);

    } catch (error) {
      console.error('Chat initialization error:', error);
      alert('Failed to create chat. Please check your network or server connection.');
      navigate('/my-chats');
    } finally {
      setLoading(false);
    }
  };

  const initializeSocket = (chatRoomId) => {
    const token = localStorage.getItem('accessToken');
    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    socketRef.current = io(SOCKET_URL, {
      auth: { token }
    });

    // Handle connection
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      // Join chat room
      socketRef.current.emit('join_chat', chatRoomId);
    });

    // Listen for new messages (emitted from backend after DB save)
    socketRef.current.on('receive_message', (newMessage) => {
      console.log('📨 Received message:', newMessage);
      
      // Check if message is from the *other* user and is *unread*
      if (newMessage.senderId !== currentUser?.id && !newMessage.isRead) {
          // Triggers the API call to mark all unread messages as read
          // This will instantly send the 'messages_read' event back to the sender
          triggerReadUpdate(chatRoomId); 
      }
      
      setMessages(prev => {
        // Prevent adding duplicate (the sender already has it via optimistic UI/API response)
        if (prev.find(m => m.id === newMessage.id)) {
          return prev;
        }
        
        // Ensure sender object is fully present for rendering
        const messageWithSender = {
          ...newMessage,
          sender: newMessage.sender || { 
            id: newMessage.senderId, 
            username: 'Unknown User' // Fallback
          }
        };

        return [...prev, messageWithSender];
      });
    });

    // Listen for typing indicator
    socketRef.current.on('user_typing', (data) => {
      if (data.userId !== currentUser?.id) {
        setIsTyping(data.isTyping);
      }
    });

    // Listen for messages read status (Blue Ticks)
    socketRef.current.on('messages_read', (data) => {
        // CRITICAL LOG: Confirm the event arrival and data
        console.log('🔵 Received messages_read event for IDs:', data.messageIds); 
        
        if (data.chatId === chatRoomId) {
            setMessages(prev => 
                prev.map(msg => {
                    // Check if the message was sent by the current user AND its ID is in the list of read messages
                    if (msg.senderId === currentUser?.id && data.messageIds.includes(msg.id)) {
                        // Mark as read only if it wasn't already
                        if (!msg.isRead) { 
                            console.log('   -> Marking message as read:', msg.id);
                            return { ...msg, isRead: true }; 
                        }
                    }
                    return msg;
                })
            );
        }
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending || !chat?.id) return;

    const messageText = input;
    setInput('');
    setSending(true);

    // Stop typing immediately
    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
    }
    if (socketRef.current && chat) {
        socketRef.current.emit('typing', {
            chatId: chat.id,
            isTyping: false
        });
    }

    // Prepare a temporary message object for instant UI update (Optimistic UI)
    const tempMessageId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempMessageId,
      senderId: currentUser.id,
      message: messageText,
      createdAt: new Date(),
      isRead: false,
      sender: { 
          id: currentUser.id, 
          username: currentUser.username || 'You' 
      }
    };
    // Optimistically add message to local state
    setMessages(prev => [...prev, tempMessage]);


    try {
      // 1. API Call: Saves to DB & triggers socket emit from backend
      const response = await chatAPI.sendMessage(chat.id, messageText);
      
      // 2. Final Update: Replace temporary message with the definitive one from the API
      setMessages(prev => prev.map(msg => 
          msg.id === tempMessageId 
              ? response.data // Replace temporary object with definitive DB object
              : msg
      ));
      
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message');
      // On failure, revert the optimistic update
      setMessages(prev => prev.filter(msg => msg.id !== tempMessageId));
      setInput(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    if (e.target.value.length > 0) {
        handleTyping(true);
    } else {
        handleTyping(false);
    }
  };

  const handleTyping = (isCurrentlyTyping) => {
    if (!socketRef.current || !chat) return;

    if (isCurrentlyTyping) {
      // Only emit start typing if it's the first character or timeout has expired
      if (!typingTimeoutRef.current) {
        socketRef.current.emit('typing', {
          chatId: chat.id,
          isTyping: true
        });
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing', {
          chatId: chat.id,
          isTyping: false
        });
        typingTimeoutRef.current = null;
      }, 1000); // 1 second timeout
      
    } else {
        // If input becomes empty, clear timeout and emit stop typing
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        socketRef.current.emit('typing', {
            chatId: chat.id,
            isTyping: false
        });
    }
  };

  const getRecipientName = () => {
    if (!chat || !currentUser) return '...';
    
    const isCurrentUserDoctor = currentUser?.role === 'doctor';
    
    if (isCurrentUserDoctor) {
        return chat.patient?.username || 'Patient';
    } else {
        return chat.doctor?.user?.username ? `Dr. ${chat.doctor.user.username}` : 'Doctor';
    }
  }

  const getRecipientSpecialization = () => {
    if (!chat) return '';
    const isCurrentUserDoctor = currentUser?.role === 'doctor';
    return !isCurrentUserDoctor && chat.doctor ? ` (${chat.doctor.specialization})` : '';
  }


  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Live Chat</h1>
        <p className="lead">
            Chatting with {getRecipientName()}{getRecipientSpecialization()}
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="chat-container">
            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isCurrentUser = msg.senderId === currentUser?.id;
                  const messageTime = new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  
                  // Determine status for the current user's *sent* messages
                  const isDelivered = !msg.id.startsWith('temp');
                  const showBlueTick = isCurrentUser && msg.isRead;
                  const showWhiteTick = isCurrentUser && isDelivered && !msg.isRead;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`message-bubble-wrapper ${isCurrentUser ? 'user' : 'doctor'}`}
                    >
                      <div className="message-bubble">
                        {!isCurrentUser && msg.sender && (
                          <small className="d-block mb-1 text-muted">
                            {msg.sender.username}
                          </small>
                        )}
                        {msg.message}
                        <div className="message-status-wrapper">
                            <small className="d-block mt-1 message-time">
                              {messageTime}
                            </small>
                            {/* Tick marks for delivered/read */}
                            {showBlueTick && <i className="bi bi-check2-all blue-tick"></i>}
                            {showWhiteTick && <i className="bi bi-check2-all white-tick"></i>}
                            {isCurrentUser && !isDelivered && 
                                <span className="spinner-border spinner-border-sm text-white ms-1" style={{ width: '0.6rem', height: '0.6rem' }}></span>
                            }
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted">
                  Start a conversation
                </div>
              )}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="message-bubble-wrapper doctor">
                  <div className="message-bubble typing-bubble">
                    <span className="typing-text">
                        {getRecipientName()} is typing
                    </span>
                    <span className="typing-indicator">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="d-flex chat-form">
              <input
                type="text"
                className="form-control me-2 chat-input"
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                disabled={sending}
              />
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={sending || !input.trim()}
              >
                {sending ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <i className="bi bi-send-fill"></i>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
