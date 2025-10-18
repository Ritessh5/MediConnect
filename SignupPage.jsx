// File: src/frontend/component/auth/SignupPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// CORRECTED PATH: Up two levels (from auth -> component -> frontend), then down into 'services'
import { authAPI } from '../../services/api.js'; 
// CORRECTED PATH: Up two levels (from auth -> component -> frontend), then down into 'pages'
import '../../pages/App.css'; 

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      
      const response = await authAPI.register(userData);
      
      if (response.status === 'success') {
        // User is logged in immediately in api.js, so redirect to home/dashboard
        alert('Sign up successful!');
        navigate('/'); 
      }
    } catch (err) {
      // Handle validation errors
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map(e => e.message).join(', ');
        setError(errorMessages);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '600px' }}>
      <h4 className="card-title text-center mb-4">Sign Up</h4>
      <form onSubmit={handleSubmit}>
        <h6 className="fw-bold mb-3 text-success">Personal Details</h6>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength="10"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <h6 className="fw-bold mb-3 mt-4 text-success">Account Details</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
            <small className="text-muted">At least 6 characters</small>
          </div>
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mt-3 p-2 text-center">{error}</div>
        )}
        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <div className="text-center mt-3">
        <p className="mb-0">
          Already a user? <Link to="/auth">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;