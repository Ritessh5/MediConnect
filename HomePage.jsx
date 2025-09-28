// Import the React library
import React from 'react';
// Import the Link component for client-side routing
import { Link } from 'react-router-dom';
// Import the useTranslation hook
import { useTranslation } from 'react-i18next';
import './App.css';

// Define the functional component for the Home Page
const HomePage = () => {
  // Use the useTranslation hook to get the t function
  const { t } = useTranslation();

  return (
    // Main container with text-align and padding
    <div className="container text-center py-5">
      {/* Main heading with animated fading effect */}
      <h1 className="fw-bold mb-3 animate-fade-in" style={{ fontSize: '3rem', animationDelay: '0.2s' }}>
        {t('smart_health_consultation')}
      </h1>
      {/* Lead paragraph with animated fading effect */}
      <p className="lead mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        {t('connect_doctors_message')}
      </p>
      {/* Container for call-to-action buttons */}
      <div className="d-flex justify-content-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {/* Link to the medicine search page */}
        <Link to="/medicine-search" className="btn btn-success me-3 px-4 py-2">
          <i className="bi bi-search me-2"></i> {t('search_medicines')}
        </Link>
        {/* Link to the find doctors page */}
        <Link to="/find-doctors" className="btn btn-outline-primary px-4 py-2">
          <i className="bi bi-person-circle me-2"></i> {t('consult_doctor')}
        </Link>
      </div>
    </div>
  );
};

// Export the component for use in other files
export default HomePage;