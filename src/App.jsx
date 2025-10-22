// Import necessary React hooks and components
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from './frontend/component/common/Header.jsx';
import Footer from './frontend/component/common/Footer.jsx';
import SplashScreen from './frontend/component/common/SplashScreen.jsx';
import ParticlesBackground from './frontend/component/common/ParticlesBackground.jsx';
import HomePage from './frontend/pages/HomePage.jsx';
import MedicineSearchPage from './frontend/pages/MedicineSearchPage.jsx';
import FindDoctorsPage from './frontend/pages/FindDoctorsPage.jsx';
import ContactPage from './frontend/pages/ContactPage.jsx';
import MyProfile from './frontend/pages/MyProfile.jsx';
import Chat from './frontend/pages/Chat.jsx'; 
import MyChatsList from './frontend/pages/MyChatsList.jsx';
import VideoCall from './frontend/pages/VideoCall.jsx';
import MyAppointmentsPage from './frontend/pages/MyAppointmentsPage.jsx';
import MyPrescriptionsPage from './frontend/pages/MyPrescriptionsPage.jsx';
import SettingsPage from './frontend/pages/SettingsPage.jsx';
import AuthPage from './frontend/pages/AuthPage.jsx';
import './frontend/pages/App.css';

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
              <Route path="/my-chats" element={<MyChatsList />} />
              <Route path="/video-call" element={<VideoCall />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
              <Route path="/my-prescriptions" element={<MyPrescriptionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage setIsLoggedIn={setIsLoggedIn} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
