import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="path-to-your-logo.png" // Replace with your logo path
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="MediConnect logo"
          />
          <span className="fw-bold text-success">MediConnect</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto me-4">
            <Link className="nav-link me-3" to="/">Home</Link>
            <Link className="nav-link me-3" to="/medicine-search">Medicine Search</Link>
            <Link className="nav-link me-3" to="/find-doctors">Find Doctors</Link>
            <Link className="nav-link" to="/contact">Contact</Link>
          </div>
          <button className="btn btn-success">Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Header;