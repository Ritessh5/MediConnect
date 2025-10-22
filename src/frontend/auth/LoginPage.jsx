// File: src/frontend/component/auth/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// CORRECTED PATH: Up two levels (from auth -> component -> frontend), then down into 'services'
import { authAPI } from '../../services/api'; 
// CORRECTED PATH: Up two levels (from auth -> component -> frontend), then down into 'pages'
import '../../pages/App.css'; 

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      
      if (response.status === 'success') {
        onLogin(true); // Update isLoggedIn state in App.jsx
        navigate('/'); // Redirect to homepage
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        {error && (
          <div className="alert alert-danger p-2 text-center">{error}</div>
        )}
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
      <div className="text-center mt-3">
        <p className="mb-0">
          New User? <Link to="/auth?mode=signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
