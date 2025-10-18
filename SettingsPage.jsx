// File: src/frontend/pages/SettingsPage.jsx (No Translation)

// Import the React library
import React from 'react';
import './App.css';

const SettingsPage = () => {

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">Settings</h1> {/* Static Text */}
        <p className="lead">Manage your account and preferences.</p> {/* Static Text */}
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <div className="mb-4 pb-4 border-bottom">
              <h5 className="fw-bold text-success mb-3">Account Settings</h5> {/* Static Text */}
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Update Profile Info
                  <i className="bi bi-chevron-right text-muted"></i>
                </li> {/* Static Text */}
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Change Password
                  <i className="bi bi-chevron-right text-muted"></i>
                </li> {/* Static Text */}
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Manage Payment Methods
                  <i className="bi bi-chevron-right text-muted"></i>
                </li> {/* Static Text */}
              </ul>
            </div>

            <div className="mb-4 pb-4 border-bottom">
              <h5 className="fw-bold text-success mb-3">Notification Preferences</h5> {/* Static Text */}
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Email Notifications
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="emailSwitch" defaultChecked />
                  </div>
                </li> {/* Static Text */}
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  SMS Notifications
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="smsSwitch" />
                  </div>
                </li> {/* Static Text */}
              </ul>
            </div>

            <div>
              <h5 className="fw-bold text-success mb-3">Privacy and Security</h5> {/* Static Text */}
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Privacy Policy
                  <i className="bi bi-chevron-right text-muted"></i>
                </li> {/* Static Text */}
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Delete Account
                  <i className="bi bi-chevron-right text-danger"></i>
                </li> {/* Static Text */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;