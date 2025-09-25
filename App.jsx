// Import necessary React hooks and components
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import HomePage from './HomePage.jsx';
import MedicineSearchPage from './MedicineSearchPage.jsx';
import FindDoctorsPage from './FindDoctorsPage.jsx';
import ContactPage from './ContactPage.jsx';
import MyProfile from './MyProfile.jsx';
import SplashScreen from './SplashScreen.jsx';
import Chat from './Chat.jsx'; 
import ParticlesBackground from './ParticlesBackground.jsx';
import FAQPage from './FAQPage.jsx'; // Import the new FAQPage component
import './App.css';

function App() {
  // State to control the visibility of the splash screen
  const [showSplash, setShowSplash] = useState(true);

  // useEffect hook to hide the splash screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, []);

  // Conditionally render the SplashScreen component
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    // Set up the router for navigation
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Render the particles background behind all other content */}
        <ParticlesBackground />
        <Header />
        <main className="flex-grow-1">
          {/* Define the routes for different pages */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/medicine-search" element={<MedicineSearchPage />} />
            <Route path="/find-doctors" element={<FindDoctorsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/chat" element={<Chat />} /> 
            <Route path="/faq" element={<FAQPage />} /> {/* Add the new route for the FAQ page */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Export the App component for use in other files
export default App;