import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '@api/api.js';
import './App.css';

const MyChatsList = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // CRITICAL: Ensure user is loaded before fetching chats
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        navigate('/auth'); // Redirect if not logged in
        return;
    }
    
    setCurrentUser(user);
    fetchChats();
  }, [navigate]); // Added navigate to dependency array

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMyChats();
      setChats(response.data);
    } catch (error) {
      console.error('Fetch chats error:', error);
      // If error is due to auth failure, redirect
      if (error.status === 401 || error.status === 403) {
          navigate('/auth');
      } else {
          alert('Failed to load chats');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (chat) => {
    // FIX: Navigate using only chatId, as the Chat component can load all details from it.
    navigate(`/chat?chatId=${chat.id}`);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">My Chats</h1>
        <p className="lead">Your conversations</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const isDoctor = currentUser?.role === 'doctor';
              const otherPerson = isDoctor 
                ? chat.patient 
                : chat.doctor?.user;
              const lastMessage = chat.messages?.[0];

              // Check if the last message was sent by the other person AND is unread
              const isUnread = lastMessage && lastMessage.senderId !== currentUser?.id && !lastMessage.isRead;

              return (
                <div 
                  key={chat.id}
                  className="card p-3 mb-3"
                  onClick={() => handleOpenChat(chat)}
                  style={{ cursor: 'pointer', backgroundColor: isUnread ? '#f0faff' : 'white' }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <i className="bi bi-person-fill text-white" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">
                          {isDoctor ? otherPerson?.username : `Dr. ${otherPerson?.username} (${chat.doctor.specialization})`}
                        </h6>
                        
                        {lastMessage && (
                          <p className={`mb-0 small ${isUnread ? 'fw-bold text-dark' : 'text-muted'}`}>
                            {/* Show Sender Name if needed */}
                            {lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                            {lastMessage.message.substring(0, 50)}
                            {lastMessage.message.length > 50 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      {chat.lastMessageAt && (
                        <small className="text-muted d-block">
                          {formatTime(chat.lastMessageAt)}
                        </small>
                      )}
                      {isUnread && (
                          <span className="badge bg-danger">
                            New
                          </span>
                      )}
                      {!isUnread && (
                          <span className={`badge ${chat.status === 'active' ? 'bg-success' : 'bg-secondary'} ms-2`}>
                            {chat.status}
                          </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted py-5">
              <i className="bi bi-chat-dots" style={{ fontSize: '4rem' }}></i>
              <p className="mt-3">No chats yet</p>
              <p>Start a conversation with a doctor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyChatsList;
