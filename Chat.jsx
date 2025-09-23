// Import the React library and necessary hooks
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Define the functional component for the live chat
const Chat = () => {
  // State to store the chat messages
  const [messages, setMessages] = useState([
    { text: 'Hello, how can I help you today?', from: 'doctor' }
  ]);
  // State to store the user's input
  const [input, setInput] = useState('');
  // Create a ref to reference the end of the messages list
  const messagesEndRef = useRef(null); 

  // Function to handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Add the new user message to the messages array
      setMessages([...messages, { text: input, from: 'user' }]);
      // Clear the input field
      setInput('');
    }
  };

  // Function to scroll to the bottom of the chat window
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
        // Add a mock doctor's response after a delay
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Thank you for your message. A doctor will respond shortly.', from: 'doctor' },
        ]);
      }, 1000); // 1-second delay for the doctor's response
    }
  }, [messages]);

  return (
    // Main container for the chat page
    <div className="container py-5">
      {/* Page header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Live Chat</h1>
        <p className="lead">Connect with a doctor for a live consultation.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="chat-container">
            {/* Message display area */}
            <div className="chat-messages">
              {messages.length > 0 ? (
                // Map through messages to display each one
                messages.map((msg, index) => (
                  <div key={index} className={`message-bubble-wrapper ${msg.from === 'user' ? 'user' : 'doctor'}`}>
                    <div className="message-bubble">
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                // Display a placeholder if no messages exist
                <div className="text-center text-muted">Start a conversation</div>
              )}
              {/* Ref to automatically scroll to the bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form for sending messages */}
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

// Export the component for use in other files
export default Chat;