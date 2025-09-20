import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const HomePage = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="fw-bold mb-3" style={{ fontSize: '3rem' }}>
        Smart Health <span className="text-success">Consultation</span>
      </h1>
      <p className="lead mb-4">
        Connect with qualified doctors online, search medicines by condition, and manage your health records - all in one secure platform.
      </p>
      <div className="d-flex justify-content-center">
        <Link to="/medicine-search" className="btn btn-success me-3 px-4 py-2">
          <i className="bi bi-search me-2"></i> Search Medicines
        </Link>
        <Link to="/find-doctors" className="btn btn-outline-primary px-4 py-2">
          <i className="bi bi-person-circle me-2"></i> Consult Doctor
        </Link>
      </div>
    </div>
  );
};

export default HomePage;