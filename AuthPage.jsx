// Import the React library and hooks
import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
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