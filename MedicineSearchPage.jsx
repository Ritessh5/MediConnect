import React, { useState } from 'react';
import './App.css';

const MedicineSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would fetch data from an API
    if (searchTerm.toLowerCase() === 'fever') {
      setSearchResults([
        {
          name: 'Paracetamol',
          alternativeName: 'Acetaminophen',
          description: 'Pain reliever and fever reducer',
          treats: ['Fever', 'Headache', 'Pain'],
          forms: ['Tablet', 'Syrup', 'Suspension'],
          isOTC: true,
        },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Medicine Search Engine</h1>
        <p className="lead">Enter a disease, symptom, or medicine name to find relevant medications</p>
      </div>

      <form onSubmit={handleSearch} className="mb-5">
        <div className="input-group mx-auto" style={{ maxWidth: '600px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search for medicines (e.g., fever, headache, diabetes)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            <i className="bi bi-search me-2"></i> Search
          </button>
        </div>
      </form>

      {searchResults.map((medicine, index) => (
        <div key={index} className="card p-4 mb-4">
          <div className="row">
            <div className="col">
              <h2 className="d-inline">{medicine.name}</h2>
              <span className="ms-3 text-muted">{medicine.alternativeName}</span>
              {medicine.isOTC && (
                <span className="badge bg-secondary ms-2">OVER THE COUNTER</span>
              )}
              <p className="mt-2">{medicine.description}</p>
              <div className="mt-3">
                <h5 className="mb-2">Treats:</h5>
                {medicine.treats.map((treat, idx) => (
                  <span key={idx} className="badge bg-light text-dark border me-2">
                    {treat}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <h5 className="mb-2">Available Forms:</h5>
                {medicine.forms.map((form, idx) => (
                  <span key={idx} className="badge bg-light text-dark border me-2">
                    {form}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicineSearchPage;