import React from 'react';
import './App.css';

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialization: 'General Medicine',
    experience: 12,
    rating: 4.8,
    degree: 'MBBS, MD',
    price: 50,
  },
  // Add more doctor data here
];

const FindDoctorsPage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Find & Consult Doctors</h1>
        <p className="lead">Connect with qualified healthcare professionals for online consultations</p>
      </div>

      <div className="card p-4 mb-5">
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
                <option>$0 - $50</option>
                <option>$51 - $100</option>
              </select>
            </div>
            <div className="col-auto d-flex justify-content-end">
              <button type="submit" className="btn btn-success me-2">Apply Filters</button>
              <button type="button" className="btn btn-outline-secondary">Clear</button>
            </div>
          </div>
        </form>
      </div>

      <div className="row gy-4">
        {doctors.map((doctor, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card p-4 text-center">
              <div className="d-flex justify-content-center mb-3">
                <div className="doctor-avatar"></div>
              </div>
              <h5 className="fw-bold text-success">{doctor.name}</h5>
              <p className="text-muted">{doctor.specialization}</p>
              <ul className="list-unstyled text-start mt-3">
                <li><i className="bi bi-briefcase me-2"></i> {doctor.experience} years experience</li>
                <li><i className="bi bi-star-fill me-2 text-warning"></i> {doctor.rating} (Excellent rating)</li>
                <li><i className="bi bi-currency-dollar me-2"></i> {doctor.price}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindDoctorsPage;