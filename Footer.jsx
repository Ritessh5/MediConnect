import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Footer = () => {
  return (
    <footer className="bg-dark-theme py-3 mt-auto">
      <div className="container">
        <div className="row justify-content-center align-items-center g-2">
          {/* MediConnect Info (Left Column) */}
          <div className="col-md-4 mb-2 mb-md-0 text-center text-md-start">
            <h5 className="fw-bold text-white mb-0">MediConnect</h5>
            <p className="text-white-50 small m-0">Smart Health Consultation</p>
          </div>

          {/* Copyright (Center Column) */}
          <div className="col-md-4 mb-2 mb-md-0 text-center">
            <p className="text-center text-white-50 m-0 small">
              &copy; {new Date().getFullYear()} MediConnect. All rights reserved.
            </p>
          </div>

          {/* Follow Us (Right Column) */}
          <div className="col-md-4 text-center text-md-end">
            <h6 className="fw-bold text-white m-0">Follow Us</h6>
            <div className="d-flex justify-content-center justify-content-md-end social-icons mt-1">
              <a href="#" className="me-2 text-white">
                <i className="bi bi-twitter-x" style={{ fontSize: '1rem' }}></i>
              </a>
              <a href="#" className="me-2 text-white">
                <i className="bi bi-facebook" style={{ fontSize: '1rem' }}></i>
              </a>
              <a href="#" className="me-2 text-white">
                <i className="bi bi-instagram" style={{ fontSize: '1rem' }}></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
