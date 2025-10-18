// Import the React library and necessary hooks
import React, { useState } from 'react';
// Import Link for navigation
import { Link } from 'react-router-dom';
import './App.css';
// Import the BookAppointmentModal component (Assuming correct path: ../component/doctor/BookAppointmentModal.jsx)
import BookAppointmentModal from '../component/doctor/BookAppointmentModal.jsx'; 

// Hardcoded data for a list of doctors (kept for reference)
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
  // State to manage the open modal: stores the doctor's name if modal is open, or null if closed
  const [modalDoctorName, setModalDoctorName] = useState(null); 

  // Function to open the modal
  const handleOpenModal = (name) => {
    setModalDoctorName(name);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalDoctorName(null);
  };

  return (
    // Main container for the page
    <div className="container py-5">
      {/* Page header and subtitle (STATIC TEXT) */}
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">Find and Consult Doctors</h1>
        <p className="lead">Connect with professionals for a consultation.</p>
      </div>

      {/* Filter form for searching doctors (omitted for brevity) */}
      {/* ... [Existing Filter Form Code] ... */}

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
              {/* List of doctor's details (STATIC TEXT) */}
              <ul className="list-unstyled text-start mt-3">
                <li><i className="bi bi-briefcase me-2"></i> {doctor.experience} years experience</li>
                <li><i className="bi bi-star-fill me-2 text-warning"></i> {doctor.rating} (Excellent Rating)</li>
                <li><i className="bi bi-currency-rupee me-2"></i> {doctor.price}</li>
              </ul>
              {/* Container for consultation buttons */}
              <div className="mt-3 d-flex flex-column">
                {/* Conditionally render Chat button (STATIC TEXT) */}
                {doctor.isChatAvailable && (
                  <Link to="/chat" className="btn btn-success mb-2">
                    <i className="bi bi-chat-dots me-2"></i> Chat Now
                  </Link>
                )}
                {/* Conditionally render Video Call button (STATIC TEXT) */}
                {doctor.isVideoCallAvailable && (
                  <button
                    type="button"
                    className="btn btn-video-call w-100"
                    onClick={() => handleOpenModal(doctor.name)} 
                  >
                    <i className="bi bi-camera-video-fill me-2"></i> Book Consultation
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conditionally render the BookAppointmentModal */}
      {modalDoctorName && (
        <BookAppointmentModal
          doctorName={modalDoctorName} // Pass the selected doctor's name
          onClose={handleCloseModal}     // Pass the close function
        />
      )}
    </div>
  );
};

// Export the component for use in other files
export default FindDoctorsPage;