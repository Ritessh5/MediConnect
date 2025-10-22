// Import the React library
import React from 'react';
import logo from './Gemini_Logo.png';
import '../../pages/App.css';

// Define the functional component for the splash screen
const SplashScreen = () => {
  return (
    // Container for the splash screen with styling from App.css
    <div className="splash-screen">
      <img
        // Set the source and alt text for the logo image
        src={logo}
        alt="MediConnect Logo"
        className="splash-screen-logo"
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  );
};

// Export the component for use in other files
export default SplashScreen;
