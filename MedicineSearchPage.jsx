// Import the React library and necessary hooks
import React, { useState } from 'react';
import './App.css';

// Define the functional component for the medicine search page
const MedicineSearchPage = () => {
  // State for the user's search input
  const [searchTerm, setSearchTerm] = useState('');
  // State to store the search results
  const [searchResults, setSearchResults] = useState([]);
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the form submission and trigger the search
  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSearchResults([]);

    // Simulate an API call with a setTimeout
    setTimeout(() => {
      // Hardcoded search logic for demonstration
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
      setIsLoading(false);
    }, 1500);
  };

  return (
    // Main container for the search page
    <div className="container py-5">
      {/* Page header and subtitle */}
      <div className="text-center mb-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="fw-bold">Medicine Search Engine</h1>
        <p className="lead">Enter a disease, symptom, or medicine name to find relevant medications</p>
      </div>

      {/* Search form with input and search button */}
      <form onSubmit={handleSearch} className="mb-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

      {/* Conditional rendering based on loading and search results */}
      {isLoading ? (
        // Display loading spinner while searching
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Searching for medicines...</p>
        </div>
      ) : searchResults.length > 0 ? (
        // Display search results if found
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {searchResults.map((medicine, index) => (
            // Card to display a single medicine result
            <div key={index} className="card p-4 mb-4">
              <div className="row">
                <div className="col">
                  <h2 className="d-inline">{medicine.name}</h2>
                  <span className="ms-3 text-muted">{medicine.alternativeName}</span>
                  {/* Display OTC badge if applicable */}
                  {medicine.isOTC && (
                    <span className="badge bg-secondary ms-2">OVER THE COUNTER</span>
                  )}
                  <p className="mt-2">{medicine.description}</p>
                  {/* Display list of conditions the medicine treats */}
                  <div className="mt-3">
                    <h5 className="mb-2">Treats:</h5>
                    {medicine.treats.map((treat, idx) => (
                      <span key={idx} className="badge bg-light text-dark border me-2">
                        {treat}
                      </span>
                    ))}
                  </div>
                  {/* Display list of available forms */}
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
      ) : (
        // Display a message if no medicines are found
        <div className="text-center mt-5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-muted">No medicines found. Please try a different search term.</p>
        </div>
      )}
    </div>
  );
};

// Export the component for use in other files
export default MedicineSearchPage;