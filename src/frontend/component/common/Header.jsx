import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../pages/App.css'; 
import logo from './MediConnectLogo.png'; 

// Define a simple placeholder function for the 't' calls (as translations are removed)
const t = (key) => key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

// Define the functional component for the header
const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // --- NEW LOGOUT HANDLER FUNCTION ---
  const handleLogout = () => {
    // In a real app, you would call your API logout function and clear localStorage here
    
    // Clear session data (MIMICING BACKEND LOGOUT/TOKEN CLEARANCE)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Update the state to logged out
    setIsLoggedIn(false); 

    // Redirect the user to the homepage
    navigate('/'); 
  };
  // ------------------------------------

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
      
      {/* Show different menu items based on user role */}
      {JSON.parse(localStorage.getItem('user'))?.role === 'doctor' ? (
        <>
          <li><Link className="dropdown-item" to="/my-chats">
            <i className="bi bi-chat-dots me-2"></i>My Chats
          </Link></li>
          <li><Link className="dropdown-item" to="/my-appointments">My Appointments</Link></li>
        </>
      ) : (
        <>
          <li><Link className="dropdown-item" to="/my-chats">
            <i className="bi bi-chat-dots me-2"></i>My Chats
          </Link></li>
          <li><Link className="dropdown-item" to="/my-appointments">My Appointments</Link></li>
          <li><Link className="dropdown-item" to="/my-prescriptions">My Prescriptions</Link></li>
        </>
      )}
      
      <li><hr className="dropdown-divider" /></li>
      <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
      <li><button className="dropdown-item" onClick={handleLogout}>Log Out</button></li>
    </ul>
  </div>
) : (
  <Link to="/auth" className="btn btn-success me-3">{t('login')}</Link>
)}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

