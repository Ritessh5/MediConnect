// Import the React library and necessary hooks
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded authentication for demonstration
    if (username === 'Ritessh' && password === 'Ritessh5') {
      onLogin(true); // Call the onLogin function to set isLoggedIn to true
      navigate('/'); // Redirect to the homepage on successful login
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
      <h4 className="card-title text-center mb-4">Log In</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-success">Log In</button>
        </div>
      </form>
      <div className="text-center mt-3">
        <p className="mb-0">New User? <Link to="/auth?mode=signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;