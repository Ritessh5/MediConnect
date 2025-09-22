import React from 'react';
import './App.css';

const MyProfile = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">My Profile</h1>
        <p className="lead">View and manage your personal and health information</p>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <div className="text-center mb-4">
              <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                <i className="bi bi-person-fill" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="mt-3">John Doe</h4>
              <p className="text-muted">Joined on: January 1, 2025</p>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-success mb-3">Personal Details</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Email Address</label>
                  <p>johndoe@example.com</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Phone Number</label>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Gender</label>
                  <p>Male</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Date of Birth</label>
                  <p>10/26/1990</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-bold">Address</label>
                  <p>123 Main Street, Anytown, USA 12345</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-success mb-3">Medical History</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Allergies
                  <span className="text-muted">None</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Current Medications
                  <span className="text-muted">Metformin</span>
                </li>
              </ul>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-outline-success">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;