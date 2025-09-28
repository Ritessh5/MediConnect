// Import the React library and necessary hooks
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Import the main application CSS file
import './App.css';

// Define the functional component for the medicine search page
const MedicineSearchPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSearchResults([]);
    setHasSearched(true);

    setTimeout(() => {
      if (searchTerm.toLowerCase() === t('fever_key').toLowerCase()) {
        setSearchResults([
          {
            name: 'Paracetamol',
            alternativeName: 'Acetaminophen',
            description: t('paracetamol_desc'),
            treats: [t('fever_key'), t('headache_key'), t('pain_key')],
            forms: [t('tablet'), t('syrup'), t('suspension')],
            isOTC: true,
          },
          {
            name: 'Ibuprofen',
            alternativeName: 'Advil, Motrin',
            description: t('ibuprofen_desc'),
            treats: [t('fever_key'), t('inflammation_key'), t('headache_key')],
            forms: [t('tablet'), t('gel_cap'), t('liquid')],
            isOTC: true,
          },
          {
            name: 'Aspirin',
            alternativeName: 'Acetylsalicylic Acid',
            description: t('aspirin_desc'),
            treats: [t('fever_key'), t('pain_key'), t('inflammation_key')],
            forms: [t('tablet'), t('chewable_tablet')],
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
        <h1 className="fw-bold">{t('medicine_search_engine')}</h1>
        <p className="lead">{t('medicine_search_subtitle')}</p>
      </div>

      <div className="bg-danger text-white p-4 rounded mb-5 animate-fade-in d-flex flex-column flex-md-row align-items-center justify-content-between" style={{ animationDelay: '0.4s' }}>
        <div className="me-md-4 mb-3 mb-md-0">
          <h5 className="fw-bold text-white"><i className="bi bi-exclamation-triangle-fill me-2"></i> {t('important_safety_info')}</h5>
          <p className="m-0 small">{t('safety_info_message')}</p>
        </div>
        <Link to="/find-doctors" className="btn btn-light text-success fw-bold flex-shrink-0">
          <i className="bi bi-person-circle me-2"></i> {t('consult_doctor')}
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="input-group mx-auto" style={{ maxWidth: '600px' }}>
          <input
            type="text"
            className="form-control"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            <i className="bi bi-search me-2"></i> {t('search')}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
          <p className="mt-2 text-muted">{t('searching_for_medicines')}</p>
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
                  {medicine.isOTC && (
                    <span className="badge bg-secondary ms-2">{t('otc')}</span>
                  )}
                  <p className="mt-2">{medicine.description}</p>
                  <div className="mt-3">
                    <h5 className="mb-2">{t('treats')}:</h5>
                    {medicine.treats.map((treat, idx) => (
                      <span key={idx} className="badge bg-light text-dark border me-2">
                        {treat}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <h5 className="mb-2">{t('available_forms')}:</h5>
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
          <p className="text-muted">{t('no_medicines_found')}</p>
        </div>
      ) : null}
    </div>
  );
};

export default MedicineSearchPage;