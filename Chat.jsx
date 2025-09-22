import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello, how can I help you today?', from: 'doctor' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // 

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, from: 'user' }]);
      setInput('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Scroll to the bottom whenever a new message is added
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mock chatbot response
    if (messages.length > 0 && messages[messages.length - 1].from === 'user') {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Thank you for your message. A doctor will respond shortly.', from: 'doctor' },
        ]);
      }, 1000); // 1-second delay for the doctor's response
    }
  }, [messages]);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Live Chat</h1>
        <p className="lead">Connect with a doctor for a live consultation.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="chat-container">
            {/* Message Display Area */}
            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className={`message-bubble-wrapper ${msg.from === 'user' ? 'user' : 'doctor'}`}>
                    <div className="message-bubble">
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted">Start a conversation</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="d-flex chat-form">
              <input
                type="text"
                className="form-control me-2 chat-input"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-success">
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;