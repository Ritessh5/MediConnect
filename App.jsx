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
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

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
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/medicine-search" element={<MedicineSearchPage />} />
            <Route path="/find-doctors" element={<FindDoctorsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/chat" element={<Chat />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
