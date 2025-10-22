// File: src/frontend/pages/AuthPage.jsx (Modified)

// Import the React library and hooks
import React from 'react';
import { useLocation } from 'react-router-dom';
// --- CORRECTED PATHS ---
import LoginPage from '../component/auth/LoginPage.jsx'; // Corrected path
import SignupPage from '../component/auth/SignupPage.jsx'; // Corrected path
// --- 

import './App.css';

const AuthPage = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isSignupMode = query.get('mode') === 'signup';

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      {isSignupMode ? (
        <SignupPage />
      ) : (
        <LoginPage onLogin={setIsLoggedIn} />
      )}
    </div>
  );
};

export default AuthPage;
