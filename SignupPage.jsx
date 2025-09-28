// Import the React library and necessary hooks
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '', // NEW: Added username field
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Simulate user creation
    console.log("New user signed up:", formData);
    alert("Sign up successful! Please log in.");
    navigate('/auth');
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '600px' }}>
      <h4 className="card-title text-center mb-4">Sign Up</h4>
      <form onSubmit={handleSubmit}>
        <h6 className="fw-bold mb-3 text-success">Personal Details</h6>
        <div className="row g-3">
          {/* NEW: Username Field */}
          <div className="col-12">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
          </div>
        </div>

        <h6 className="fw-bold mb-3 mt-4 text-success">Account Details</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3 p-2 text-center">{error}</div>}
        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-success">Sign Up</button>
        </div>
      </form>
      <div className="text-center mt-3">
        <p className="mb-0">Already a user? <Link to="/auth">Log in</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;