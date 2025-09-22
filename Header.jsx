import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './Gemini_Logo.png';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
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
            {/* Nav Links with Icons */}
            <Link className="nav-link me-3" to="/">
              <i className="bi bi-house-door-fill me-2"></i>Home
            </Link>
            <Link className="nav-link me-3" to="/medicine-search">
              <i className="bi bi-search me-2"></i>Medicine Search
            </Link>
            <Link className="nav-link me-3" to="/find-doctors">
              <i className="bi bi-person-fill me-2"></i>Find Doctors
            </Link>
            <Link className="nav-link" to="/contact">
              <i className="bi bi-envelope-fill me-2"></i>Contact
            </Link>
          </div>
          {/* Profile Dropdown Button */}
          <div className="dropdown">
            <button
              className="nav-link dropdown-toggle" // ⬅️ UPDATED
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle me-2"></i>Profile
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li><Link className="dropdown-item" to="/my-profile">My Profile</Link></li>
              <li><Link className="dropdown-item" to="/my-appointments">My Appointments</Link></li>
              <li><Link className="dropdown-item" to="/my-prescriptions">My Prescriptions</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
              <li><Link className="dropdown-item" to="/logout">Log Out</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
