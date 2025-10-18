// File: src/frontend/pages/MyPrescriptionsPage.jsx (No Translation)

// Import the React library
import React from 'react';
import './App.css';

// Hardcoded data for user's prescriptions
const prescriptions = [
  {
    doctorName: 'Dr. Sarah Johnson',
    specialization: 'General Medicine', // Static text replacement
    date: 'Sep 25, 2025',
    medicine: 'Ibuprofen (Advil)',
    dosage: '200mg, twice a day',
  },
  {
    doctorName: 'Dr. Emily Chen',
    specialization: 'Pediatrics', // Static text replacement
    date: 'Sep 10, 2025',
    medicine: 'Amoxicillin',
    dosage: '250mg, three times a day',
  },
  {
    doctorName: 'Dr. David Lee',
    specialization: 'Cardiology', // Static text replacement
    date: 'Aug 20, 2025',
    medicine: 'Lisinopril',
    dosage: '10mg, once a day',
  },
];

const MyPrescriptionsPage = () => {

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">My Prescriptions</h1> {/* Static Text */}
        <p className="lead">View and download your past prescriptions.</p> {/* Static Text */}
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription, index) => (
              <div key={index} className="card p-4 mb-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="fw-bold">{prescription.medicine}</h5>
                    <p className="text-muted mb-1">Prescribed By: {prescription.doctorName} ({prescription.specialization})</p> {/* Static Text */}
                    <p className="text-muted mb-0">Date: {prescription.date}</p> {/* Static Text */}
                    <p className="mb-0">Dosage: **{prescription.dosage}**</p> {/* Static Text */}
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <button className="btn btn-success me-2">
                      <i className="bi bi-file-earmark-arrow-down me-2"></i> Download
                    </button> {/* Static Text */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">
              <p>No prescriptions on record.</p> {/* Static Text */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPrescriptionsPage;