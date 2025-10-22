import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { medicineAPI } from '@api/api.js'; // Corrected Alias Import
import { 
  searchMedicineByName, 
  searchMedicineApproximate,
  getRelatedMedicines,
  searchByIngredient
} from '../services/externalMedicineAPI.js';
import './App.css';

const MedicineSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [localResults, setLocalResults] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('local');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [relatedMedicines, setRelatedMedicines] = useState(null);
  const [showRelated, setShowRelated] = useState(false);

  const popularSearches = {
    symptoms: ['Fever', 'Headache', 'Cough', 'Cold', 'Pain', 'Allergy'],
    medicines: ['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Cetirizine']
  };

  /**
   * Helper function to remove duplicates from an array of medicine objects
   * based on the medicine's name.
   */
  const deduplicateMedicines = (medicines) => {
    const uniqueNames = new Set();
    const uniqueMedicines = [];
    
    for (const medicine of medicines) {
      // Use a consistent key for de-duplication, like lower-cased name + manufacturer
      const key = `${medicine.name.toLowerCase()}-${medicine.manufacturer.toLowerCase()}`;
      if (!uniqueNames.has(key)) {
        uniqueNames.add(key);
        uniqueMedicines.push(medicine);
      }
    }
    return uniqueMedicines;
  };

  const handleSearch = async (e, quickTerm = null, quickType = null) => {
    if (e) e.preventDefault();
    
    const term = quickTerm || searchTerm;
    const type = quickType || searchType;
    
    if (!term.trim()) {
      alert('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setLocalResults([]);
    setExternalResults([]);
    setHasSearched(true);
    setSelectedMedicine(null);
    setRelatedMedicines(null);
    setShowRelated(false);

    try {
      // Standardize the local search call
      const localResponse = await medicineAPI.searchMedicines(term, type);
      
      // CRITICAL FIX: Deduplicate the local results array before setting state
      const uniqueLocalResults = deduplicateMedicines(localResponse.data || []);
      setLocalResults(uniqueLocalResults);

      // Search external API
      let extResults = [];
      
      if (type === 'name' || type === 'disease') {
        extResults = await searchMedicineByName(term);
        
        if (extResults.length === 0) {
          const approximateResults = await searchMedicineApproximate(term);
          extResults = approximateResults.slice(0, 10);
        }
      } else if (type === 'ingredient') {
        extResults = await searchByIngredient(term);
      } else if (type === 'symptom') {
        const symptomMap = {
          'pain': 'analgesic',
          'fever': 'antipyretic',
          'headache': 'analgesic',
          'cough': 'antitussive',
          'cold': 'decongestant',
          'allergy': 'antihistamine',
          'infection': 'antibiotic'
        };
        
        const drugClass = symptomMap[term.toLowerCase()];
        if (drugClass) {
          extResults = await searchMedicineByName(drugClass);
        }
      }

      setExternalResults(extResults);
      
      if (uniqueLocalResults.length === 0 && extResults.length > 0) {
        setActiveTab('external');
      } else {
        setActiveTab('local');
      }

    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search medicines. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (term, type) => {
    setSearchTerm(term);
    setSearchType(type);
    handleSearch(null, term, type);
  };

  const handleMedicineClick = async (medicine, isExternal = false) => {
    setSelectedMedicine(medicine);
    setShowRelated(true);
    
    if (isExternal && medicine.rxcui) {
      try {
        const related = await getRelatedMedicines(medicine.rxcui);
        setRelatedMedicines(related);
      } catch (error) {
        console.error('Error loading related medicines:', error);
      }
    }
  };

  const totalResults = localResults.length + externalResults.length;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">Medicine Search Engine</h1>
        <p className="lead">Search for medicines by name, symptom, disease, or ingredient</p>
      </div>

      {/* Safety Warning */}
      <div className="bg-danger text-white p-4 rounded mb-5 animate-fade-in d-flex flex-column flex-md-row align-items-center justify-content-between" style={{ animationDelay: '0.4s' }}>
        <div className="me-md-4 mb-3 mb-md-0">
          <h5 className="fw-bold text-white">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> 
            Important Safety Information
          </h5>
          <p className="m-0 small">
            This information is for reference only. Always consult a healthcare professional before taking any medication.
          </p>
        </div>
        <Link to="/find-doctors" className="btn btn-light text-success fw-bold flex-shrink-0">
          <i className="bi bi-person-circle me-2"></i> Consult Doctor
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="row g-2 mx-auto" style={{ maxWidth: '800px' }}>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="name">Medicine Name</option>
              <option value="symptom">Symptom</option>
              <option value="disease">Disease/Condition</option>
              <option value="ingredient">Ingredient</option>
            </select>
          </div>
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-search me-2"></i>
              )}
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.7s' }}>
        <p className="text-muted mb-2">Popular searches:</p>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {popularSearches.symptoms.map((symptom) => (
            <span 
              key={symptom}
              className="badge bg-light text-dark border"
              style={{ cursor: 'pointer' }}
              onClick={() => handleQuickSearch(symptom, 'symptom')}
            >
              {symptom}
            </span>
          ))}
          {popularSearches.medicines.map((medicine) => (
            <span 
              key={medicine}
              className="badge bg-secondary"
              style={{ cursor: 'pointer' }}
              onClick={() => handleQuickSearch(medicine, 'name')}
            >
              {medicine}
            </span>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Searching for medicines...</p>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && hasSearched && totalResults > 0 && (
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h4 className="mb-4">Found {totalResults} medicine(s) for "{searchTerm}"</h4>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'local' ? 'active' : ''}`}
                onClick={() => setActiveTab('local')}
              >
                Local Database ({localResults.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'external' ? 'active' : ''}`}
                onClick={() => setActiveTab('external')}
              >
                External Database ({externalResults.length})
              </button>
            </li>
          </ul>

          {/* Local Results */}
          {activeTab === 'local' && (
            <div>
              {localResults.length > 0 ? (
                localResults.map((medicine) => ( // Removed index, medicine.id is the key
                  <div 
                    key={medicine.id} 
                    className="card p-4 mb-4 card-animate-in"
                    // Removed animation delay for simplicity, was using index
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleMedicineClick(medicine, false)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h2 className="d-inline">{medicine.name}</h2>
                        <span className="ms-3 text-muted">{medicine.alternativeName}</span>
                        {medicine.isOTC && <span className="badge bg-success ms-2">OTC</span>}
                        {medicine.isPrescriptionRequired && (
                          <span className="badge bg-warning text-dark ms-2">Prescription Required</span>
                        )}
                      </div>
                      {medicine.price && (
                        <h4 className="text-success mb-0">₹{medicine.price}</h4>
                      )}
                    </div>
                    
                    <p className="mt-3">{medicine.description}</p>
                    
                    {medicine.manufacturer && (
                      <p className="mb-2"><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
                    )}
                    
                    {medicine.composition && (
                      <p className="mb-2"><strong>Composition:</strong> {medicine.composition}</p>
                    )}
                    
                    <div className="mt-3">
                      <h5 className="mb-2">Treats:</h5>
                      {medicine.treats.map((treat, idx) => (
                        <span key={idx} className="badge bg-light text-dark border me-2 mb-2">
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

                    {medicine.dosage && (
                      <div className="mt-3">
                        <h5 className="mb-2">Dosage:</h5>
                        <p className="text-muted">{medicine.dosage}</p>
                      </div>
                    )}

                    {medicine.sideEffects && (
                      <div className="mt-3">
                        <h5 className="mb-2 text-danger">Side Effects:</h5>
                        <p className="text-muted">{medicine.sideEffects}</p>
                      </div>
                    )}

                    {medicine.precautions && (
                      <div className="mt-3">
                        <h5 className="mb-2 text-warning">Precautions:</h5>
                        <p className="text-muted">{medicine.precautions}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No medicines found in local database. Check external sources.
                </div>
              )}
            </div>
          )}

          {/* External Results */}
          {activeTab === 'external' && (
            <div>
              {externalResults.length > 0 ? (
                <>
                  <div className="alert alert-info mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    Results from RxNorm (U.S. National Library of Medicine)
                  </div>
                  {externalResults.map((medicine, index) => (
                    <div 
                      key={medicine.rxcui || index}
                      className="card p-4 mb-4 card-animate-in"
                      style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }}
                      onClick={() => handleMedicineClick(medicine, true)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h3 className="mb-1">{medicine.name}</h3>
                          {medicine.synonym && (
                            <p className="text-muted mb-0 small">{medicine.synonym}</p>
                          )}
                        </div>
                        <span className="badge bg-primary">{medicine.tty}</span>
                      </div>
                      
                      <div className="mt-2">
                        <small className="text-secondary">
                          <strong>RxCUI:</strong> {medicine.rxcui}
                        </small>
                      </div>
                      
                      {medicine.score && (
                        <div className="mt-2">
                          <span className="badge bg-warning">Match Score: {medicine.score}</span>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <small className="text-muted">
                          <i className="bi bi-hand-thumbs-up me-1"></i>
                          Click to see related medicines
                        </small>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No medicines found in external database.
                </div>
              )}
            </div>
          )}

          {/* Related Medicines */}
          {showRelated && selectedMedicine && relatedMedicines && (
            <div className="card mt-4 p-4">
              <h5 className="mb-3">
                <i className="bi bi-link-45deg me-2"></i>
                Related Medicines for "{selectedMedicine.name}"
              </h5>
              
              {relatedMedicines.branded.length > 0 && (
                <div className="mb-3">
                  <h6 className="text-primary mb-2">
                    <i className="bi bi-tag me-2"></i>Branded Versions
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {relatedMedicines.branded.map((med, idx) => (
                      <span key={idx} className="badge bg-primary p-2">{med.name}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {relatedMedicines.generic.length > 0 && (
                <div className="mb-3">
                  <h6 className="text-success mb-2">
                    <i className="bi bi-capsule me-2"></i>Generic Alternatives
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {relatedMedicines.generic.map((med, idx) => (
                      <span key={idx} className="badge bg-success p-2">{med.name}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {relatedMedicines.branded.length === 0 && relatedMedicines.generic.length === 0 && (
                <p className="text-muted mb-0">No related medicines found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!isLoading && hasSearched && totalResults === 0 && (
        <div className="text-center mt-5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <i className="bi bi-search" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
          <p className="text-muted mt-3">No medicines found for "{searchTerm}"</p>
          <p className="text-muted">Try searching with different keywords or check spelling</p>
        </div>
      )}
    </div>
  );
};

export default MedicineSearchPage;
