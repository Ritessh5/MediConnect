// Import the React library
import React from 'react';
// Import Link for navigation
import { Link } from 'react-router-dom';
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
  return (
    // Main container for the page
    <div className="container py-5">
      {/* Page header and subtitle */}
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">Find & Consult Doctors</h1>
        <p className="lead">Connect with qualified healthcare professionals for online consultations</p>
      </div>

      {/* Filter form for searching doctors */}
      <div className="card p-4 mb-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <form>
          <div className="row g-3 align-items-end">
            {/* Specialization filter dropdown */}
            <div className="col-md-4">
              <label className="form-label">Specialization</label>
              <select className="form-select">
                <option>All Specializations</option>
                <option>General Medicine</option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
              </select>
            </div>
            {/* Consultation type filter dropdown */}
            <div className="col-md-4">
              <label className="form-label">Consultation Type</label>
              <select className="form-select">
                <option>All Types</option>
                <option>Video Call</option>
                <option>Chat</option>
              </select>
            </div>
            {/* Price range filter dropdown */}
            <div className="col-md-4">
              <label className="form-label">Price Range</label>
              <select className="form-select">
                <option>Any Price</option>
                <option>₹0 - ₹500</option>
                <option>₹501 - ₹1000</option>
              </select>
            </div>
            {/* Apply and Clear filter buttons */}
            <div className="col-auto d-flex justify-content-end">
              <button type="submit" className="btn btn-success me-2">Apply Filters</button>
              <button type="button" className="btn btn-outline-secondary">Clear</button>
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
              <p className="fw-bold text-muted">{doctor.specialization}</p> 
              {/* List of doctor's details */}
              <ul className="list-unstyled text-start mt-3">
                <li><i className="bi bi-briefcase me-2"></i> {doctor.experience} years experience</li>
                <li><i className="bi bi-star-fill me-2 text-warning"></i> {doctor.rating} (Excellent rating)</li>
                <li><i className="bi bi-currency-rupee me-2"></i> {doctor.price}</li> 
              </ul>
              {/* Container for consultation buttons */}
              <div className="mt-3 d-flex justify-content-center">
                {/* Conditionally render Chat button */}
                {doctor.isChatAvailable && (
                  <Link to="/chat" className="btn btn-success me-2">
                    <i className="bi bi-chat-dots me-2"></i> Chat Now
                  </Link>
                )}
                {/* Conditionally render Video Call button */}
                {doctor.isVideoCallAvailable && ( 
                  <Link to="/chat" className="btn btn-outline-primary">
                    <i className="bi bi-camera-video-fill me-2"></i> Video Call
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