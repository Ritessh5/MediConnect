import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-auto border-top">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0 text-center text-md-start">
            <h5 className="fw-bold text-success">MediConnect</h5>
            <p className="text-muted">Smart Health Consultation</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0 text-center">
            <h6 className="fw-bold">Quick Links</h6>
            <nav className="nav flex-column">
              <Link className="nav-link text-muted p-0" to="/">Home</Link>
              <Link className="nav-link text-muted p-0" to="/medicine-search">Medicine Search</Link>
              <Link className="nav-link text-muted p-0" to="/find-doctors">Find Doctors</Link>
              <Link className="nav-link text-muted p-0" to="/contact">Contact</Link>
            </nav>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <h6 className="fw-bold">Follow Us</h6>
            <div className="d-flex justify-content-center justify-content-md-end">
              <a href="#" className="me-3 text-muted">
                <i className="bi bi-twitter" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="me-3 text-muted">
                <i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="me-3 text-muted">
                <i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="mt-3 mb-2" />
        <p className="text-center text-muted m-0">
          © {new Date().getFullYear()} MediConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;