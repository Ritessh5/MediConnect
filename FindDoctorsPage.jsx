// Import the React library and necessary hooks
import React, { useState } from 'react';
// Import Link for navigation
import { Link } from 'react-router-dom';
import BookAppointmentModal from './BookAppointmentModal.jsx'; // Import the new component
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
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const handleBookAppointment = (doctorName) => {
    setSelectedDoctor(doctorName);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor('');
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">Find & Consult Doctors</h1>
        <p className="lead">Connect with qualified healthcare professionals for online consultations</p>
      </div>

      <div className="card p-4 mb-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <form>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Specialization</label>
              <select className="form-select">
                <option>All Specializations</option>
                <option>General Medicine</option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Consultation Type</label>
              <select className="form-select">
                <option>All Types</option>
                <option>Video Call</option>
                <option>Chat</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Price Range</label>
              <select className="form-select">
                <option>Any Price</option>
                <option>₹0 - ₹500</option>
                <option>₹501 - ₹1000</option>
              </select>
            </div>
            <div className="col-auto d-flex justify-content-end">
              <button type="submit" className="btn btn-success me-2">Apply Filters</button>
              <button type="button" className="btn btn-outline-secondary">Clear</button>
            </div>
          </div>
        </form>
      </div>

      <div className="row gy-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        {doctors.map((doctor, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card p-4 text-center">
              <div className="d-flex justify-content-center mb-3">
                <div className="doctor-avatar"></div>
              </div>
              <h5 className="fw-bold text-success">{doctor.name}</h5>
              <p className="fw-bold text-muted">{doctor.specialization}</p> 
              <ul className="list-unstyled text-start mt-3">
                <li><i className="bi bi-briefcase me-2"></i> {doctor.experience} years experience</li>
                <li><i className="bi bi-star-fill me-2 text-warning"></i> {doctor.rating} (Excellent rating)</li>
                <li><i className="bi bi-currency-rupee me-2"></i> {doctor.price}</li> 
              </ul>
              <div className="mt-3 d-flex flex-column">
                {doctor.isChatAvailable && (
                  <Link to="/chat" className="btn btn-success mb-2">
                    <i className="bi bi-chat-dots me-2"></i> Start Chat
                  </Link>
                )}
                {doctor.isVideoCallAvailable && ( 
                  <button onClick={() => handleBookAppointment(doctor.name)} className="btn btn-video-call w-100">
                    <i className="bi bi-camera-video-fill me-2"></i> Book Consultation
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <BookAppointmentModal doctorName={selectedDoctor} onClose={handleCloseModal} />}
    </div>
  );
};

export default FindDoctorsPage;