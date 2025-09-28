// Import necessary React hooks and components
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Import the i18n configuration
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
import MyAppointmentsPage from './MyAppointmentsPage.jsx';
import MyPrescriptionsPage from './MyPrescriptionsPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import AuthPage from './AuthPage.jsx';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <ParticlesBackground />
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/medicine-search" element={<MedicineSearchPage />} />
              <Route path="/find-doctors" element={<FindDoctorsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/chat" element={<Chat />} /> 
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
              <Route path="/my-prescriptions" element={<MyPrescriptionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;