import React from 'react';
import logo from './Gemini_Logo.png';
import './App.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <img
        src={logo}
        alt="MediConnect Logo"
        className="splash-screen-logo"
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  );
};

export default SplashScreen;