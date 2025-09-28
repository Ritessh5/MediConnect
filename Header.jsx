// Import the React library
import React from 'react';
// Import Link for navigation without page reload
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import logo from './MediConnectLogo.png';

// Define the functional component for the header
const Header = ({ isLoggedIn }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    // Main navigation bar with Bootstrap classes for styling and a shadow effect
    <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm">
      <div className="container">
        {/* Brand logo and name linking to the home page */}
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
        {/* Toggler button for responsive mobile navigation */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Container for collapsible navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation links aligned to the right */}
          <div className="navbar-nav ms-auto me-4">
            {/* Nav links with icons */}
            <Link className="nav-link me-3" to="/">
              <i className="bi bi-house-door-fill me-2"></i>{t('home')}
            </Link>
            <Link className="nav-link me-3" to="/medicine-search">
              <i className="bi bi-search me-2"></i>{t('medicine_search')}
            </Link>
            <Link className="nav-link me-3" to="/find-doctors">
              <i className="bi bi-person-fill me-2"></i>{t('find_doctors')}
            </Link>
            <Link className="nav-link" to="/contact">
              <i className="bi bi-envelope-fill me-2"></i>{t('contact')}
            </Link>
          </div>
          
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>{t('profile')}
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
            ) : (
              <Link to="/auth" className="btn btn-success me-3">{t('login')}</Link>
            )}

            {/* Language Switcher */}
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="languageDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {i18n.language.toUpperCase()}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                <li><button className="dropdown-item" onClick={() => changeLanguage('en')}>English</button></li>
                <li><button className="dropdown-item" onClick={() => changeLanguage('hi')}>Hindi</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Export the component for use in other files
export default Header;