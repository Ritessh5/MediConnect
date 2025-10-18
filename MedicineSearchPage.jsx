// File: src/frontend/pages/MedicineSearchPage.jsx (Final Corrected Version)

// Import the React library and necessary hooks
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Import the main application CSS file
import './App.css';

// Define the functional component for the medicine search page
const MedicineSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Define static strings for placeholder text and medicine data
  const STATIC = {
    FEVER_KEY: 'fever',
    PARACETAMOL_DESC: 'A common pain reliever and fever reducer.',
    IBUPROFEN_DESC: 'A nonsteroidal anti-inflammatory drug (NSAID) used for pain, fever, and inflammation.',
    ASPIRIN_DESC: 'Used to reduce pain, fever, and inflammation, and as an antiplatelet agent.',
    HEADACHE: 'Headache',
    PAIN: 'Pain',
    INFLAMMATION: 'Inflammation',
    TABLET: 'Tablet',
    SYRUP: 'Syrup',
    SUSPENSION: 'Suspension',
    GEL_CAP: 'Gel Cap',
    LIQUID: 'Liquid',
    CHEWABLE_TABLET: 'Chewable Tablet',
    OTC: 'OTC (Over The Counter)',
    LOADING_TEXT: 'Searching for medicines...',
    NO_RESULTS: 'No medicines found matching your search term.',
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSearchResults([]);
    setHasSearched(true);

    setTimeout(() => {
      // Use the static key for comparison
      if (searchTerm.toLowerCase() === STATIC.FEVER_KEY) {
        setSearchResults([
          {
            name: 'Paracetamol',
            alternativeName: 'Acetaminophen',
            description: STATIC.PARACETAMOL_DESC,
            treats: [STATIC.FEVER_KEY, STATIC.HEADACHE, STATIC.PAIN],
            forms: [STATIC.TABLET, STATIC.SYRUP, STATIC.SUSPENSION],
            isOTC: true,
          },
          {
            name: 'Ibuprofen',
            alternativeName: 'Advil, Motrin',
            description: STATIC.IBUPROFEN_DESC,
            treats: [STATIC.FEVER_KEY, STATIC.INFLAMMATION, STATIC.HEADACHE],
            forms: [STATIC.TABLET, STATIC.GEL_CAP, STATIC.LIQUID],
            isOTC: true,
          },
          {
            name: 'Aspirin',
            alternativeName: 'Acetylsalicylic Acid',
            description: STATIC.ASPIRIN_DESC,
            treats: [STATIC.FEVER_KEY, STATIC.PAIN, STATIC.INFLAMMATION],
            forms: [STATIC.TABLET, STATIC.CHEWABLE_TABLET],
            isOTC: true,
          },
        ]);
      } else {
        setSearchResults([]);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">Medicine Search Engine</h1>
        <p className="lead">Find information on over-the-counter and prescription medicines.</p>
      </div>

      {/* Safety Info Box (Static Text) */}
      <div className="bg-danger text-white p-4 rounded mb-5 animate-fade-in d-flex flex-column flex-md-row align-items-center justify-content-between" style={{ animationDelay: '0.4s' }}>
        <div className="me-md-4 mb-3 mb-md-0">
          <h5 className="fw-bold text-white"><i className="bi bi-exclamation-triangle-fill me-2"></i> Important Safety Information</h5>
          <p className="m-0 small">Always consult a doctor before starting or stopping any medication, even over-the-counter drugs.</p>
        </div>
        <Link to="/find-doctors" className="btn btn-light text-success fw-bold flex-shrink-0">
          <i className="bi bi-person-circle me-2"></i> Consult a Doctor
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="input-group mx-auto" style={{ maxWidth: '600px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., fever, headache, Ibuprofen" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            <i className="bi bi-search me-2"></i> Search
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">{STATIC.LOADING_TEXT}</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          {searchResults.map((medicine, index) => (
            <div 
              key={index} 
              className="card p-4 mb-4 card-animate-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="row">
                <div className="col">
                  <h2 className="d-inline">{medicine.name}</h2>
                  <span className="ms-3 text-muted">{medicine.alternativeName}</span>
                  {/* Corrected conditional rendering block for the syntax error */}
                  {medicine.isOTC && (
                    <span className="badge bg-secondary ms-2">{STATIC.OTC}</span>
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
      ) : hasSearched ? (
        <div className="text-center mt-5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-muted">{STATIC.NO_RESULTS}</p>
        </div>
      ) : null}
    </div>
  );
};

export default MedicineSearchPage;