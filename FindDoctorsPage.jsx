import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { doctorAPI, isAuthenticated } from '@api/api.js'; // Corrected Alias Import
import BookAppointmentModal from '../component/doctor/BookAppointmentModal.jsx';
import './App.css';

const FindDoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    consultationType: '',
    minFee: '',
    maxFee: ''
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAllDoctors(appliedFilters);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const appliedFilters = {};
    
    if (filters.specialization) appliedFilters.specialization = filters.specialization;
    if (filters.minFee) appliedFilters.minFee = filters.minFee;
    if (filters.maxFee) appliedFilters.maxFee = filters.maxFee;
    
    if (filters.consultationType === 'Video Call') {
      appliedFilters.isVideoCallAvailable = true;
    } else if (filters.consultationType === 'Chat') {
      appliedFilters.isChatAvailable = true;
    }

    fetchDoctors(appliedFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      consultationType: '',
      minFee: '',
      maxFee: ''
    });
    fetchDoctors();
  };

  const handleBookAppointment = (doctor) => {
    if (!isAuthenticated()) {
      alert('Please login to book an appointment');
      navigate('/auth');
      return;
    }
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">Find and Consult Doctors</h1>
        <p className="lead">Connect with professionals for a consultation.</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <form onSubmit={handleApplyFilters}>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Specialization</label>
              <select 
                className="form-select" 
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
              >
                <option value="">All Specializations</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Consultation Type</label>
              <select 
                className="form-select"
                name="consultationType"
                value={filters.consultationType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Video Call">Video Call</option>
                <option value="Chat">Chat</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Min Fee (₹)</label>
              <input 
                type="number" 
                className="form-control"
                name="minFee"
                value={filters.minFee}
                onChange={handleFilterChange}
                placeholder="0"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Max Fee (₹)</label>
              <input 
                type="number" 
                className="form-control"
                name="maxFee"
                value={filters.maxFee}
                onChange={handleFilterChange}
                placeholder="1000"
              />
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button type="submit" className="btn btn-success flex-grow-1">
                Apply
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Doctors Grid */}
      {doctors.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No doctors found matching your filters.</p>
        </div>
      ) : (
        <div className="row gy-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {doctors.map((doctor, index) => (
            <div key={doctor.id} className="col-md-6 col-lg-4">
              <div className="card p-4 text-center h-100">
                <div className="d-flex justify-content-center mb-3">
                  <div className="doctor-avatar">
                    <i className="bi bi-person-fill" style={{ fontSize: '3rem', color: '#198754' }}></i>
                  </div>
                </div>
                <h5 className="fw-bold text-success">{doctor.user.username}</h5>
                <p className="fw-bold text-muted">{doctor.specialization}</p>
                
                <ul className="list-unstyled text-start mt-3">
                  <li>
                    <i className="bi bi-mortarboard me-2"></i> {doctor.degree}
                  </li>
                  <li>
                    <i className="bi bi-briefcase me-2"></i> {doctor.experience} years experience
                  </li>
                  <li>
                    <i className="bi bi-star-fill me-2 text-warning"></i> {doctor.rating} (Excellent Rating)
                  </li>
                  <li>
                    <i className="bi bi-currency-rupee me-2"></i> ₹{doctor.consultationFee}
                  </li>
                </ul>

                <div className="mt-auto">
                  <div className="d-flex gap-2 mb-2">
                    {doctor.isChatAvailable && (
                      <Link to={`/chat?doctorId=${doctor.id}`}className="btn btn-outline-success btn-sm w-100 mb-2">
                        <i className="bi bi-chat-dots me-2"></i> Chat Now
                      </Link>
                    )}
                    {doctor.isVideoCallAvailable && (
                      <span className="badge bg-light text-dark border flex-grow-1">
                        <i className="bi bi-camera-video me-1"></i> Video
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-success w-100"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Modal */}
      {showModal && selectedDoctor && (
        <BookAppointmentModal
          doctor={selectedDoctor}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FindDoctorsPage;