// Import the React library
import React from 'react';
// Import Link for navigation
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';

// Hardcoded data for a list of doctors
const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialization: 'General Medicine',
    experience: 12,
    rating: 4.8,
    degree: 'MBBS, MD',
    price: 450, 
    isChatAvailable: true,
    isVideoCallAvailable: true,
  },
  {
    name: 'Dr. David Lee',
    specialization: 'Cardiology',
    experience: 8,
    rating: 4.5,
    degree: 'MD',
    price: 800, 
    isChatAvailable: true,
    isVideoCallAvailable: false, 
  },
  {
    name: 'Dr. Emily Chen',
    specialization: 'Pediatrics',
    experience: 10,
    rating: 4.9,
    degree: 'MBBS',
    price: 600, 
    isChatAvailable: true,
    isVideoCallAvailable: true,
  },
];

// Define the functional component for the Find Doctors page
const FindDoctorsPage = () => {
  const { t } = useTranslation();
  
  return (
    // Main container for the page
    <div className="container py-5">
      {/* Page header and subtitle */}
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">{t('find_and_consult_doctors')}</h1>
        <p className="lead">{t('connect_with_professionals')}</p>
      </div>

      {/* Filter form for searching doctors */}
      <div className="card p-4 mb-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <form>
          <div className="row g-3 align-items-end">
            {/* Specialization filter dropdown */}
            <div className="col-md-4">
              <label className="form-label">{t('specialization')}</label>
              <select className="form-select">
                <option>{t('all_specializations')}</option>
                <option>{t('general_medicine')}</option>
                <option>{t('cardiology')}</option>
                <option>{t('pediatrics')}</option>
              </select>
            </div>
            {/* Consultation type filter dropdown */}
            <div className="col-md-4">
              <label className="form-label">{t('consultation_type')}</label>
              <select className="form-select">
                <option>{t('all_types')}</option>
                <option>{t('video_call')}</option>
                <option>{t('chat')}</option>
              </select>
            </div>
            {/* Price range filter dropdown */}
            <div className="col-md-4">
              <label className="form-label">{t('price_range')}</label>
              <select className="form-select">
                <option>{t('any_price')}</option>
                <option>{t('price_range_1')}</option>
                <option>{t('price_range_2')}</option>
              </select>
            </div>
            {/* Apply and Clear filter buttons */}
            <div className="col-auto d-flex justify-content-end">
              <button type="submit" className="btn btn-success me-2">{t('apply_filters')}</button>
              <button type="button" className="btn btn-outline-secondary">{t('clear')}</button>
            </div>
          </div>
        </form>
      </div>

      {/* Grid container for displaying doctor cards */}
      <div className="row gy-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {/* Map over the doctors array to create a card for each doctor */}
        {doctors.map((doctor, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card p-4 text-center">
              {/* Doctor avatar */}
              <div className="d-flex justify-content-center mb-3">
                <div className="doctor-avatar"></div>
              </div>
              {/* Doctor's name and specialization */}
              <h5 className="fw-bold text-success">{doctor.name}</h5>
              <p className="fw-bold text-muted">{t(doctor.specialization.toLowerCase().replace(' ', '_'))}</p> 
              {/* List of doctor's details */}
              <ul className="list-unstyled text-start mt-3">
                <li><i className="bi bi-briefcase me-2"></i> {doctor.experience} {t('years_experience')}</li>
                <li><i className="bi bi-star-fill me-2 text-warning"></i> {doctor.rating} ({t('excellent_rating')})</li>
                <li><i className="bi bi-currency-rupee me-2"></i> {doctor.price}</li> 
              </ul>
              {/* Container for consultation buttons */}
              <div className="mt-3 d-flex flex-column">
                {/* Conditionally render Chat button */}
                {doctor.isChatAvailable && (
                  <Link to="/chat" className="btn btn-success mb-2">
                    <i className="bi bi-chat-dots me-2"></i> {t('chat_now')}
                  </Link>
                )}
                {/* Conditionally render Video Call button */}
                {doctor.isVideoCallAvailable && ( 
                  <Link to="/book-appointment" className="btn btn-video-call w-100">
                    <i className="bi bi-camera-video-fill me-2"></i> {t('book_consultation')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component for use in other files
export default FindDoctorsPage;