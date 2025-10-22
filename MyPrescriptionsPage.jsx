import React, { useState, useEffect } from 'react';
import { prescriptionAPI } from '@api/api.js'; // Corrected Alias Import
import './App.css';

const MyPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionAPI.getMyPrescriptions();
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Fetch prescriptions error:', error);
      alert('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">My Prescriptions</h1>
        <p className="lead">View your medical prescriptions</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10">
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription, index) => (
              <div
                key={prescription.id}
                className="card p-4 mb-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="row align-items-center mb-3">
                  <div className="col-md-8">
                    <h5 className="fw-bold mb-1">
                      Prescription from Dr. {prescription.doctor.user.username}
                    </h5>
                    <p className="text-muted mb-0">
                      <i className="bi bi-calendar3 me-2"></i>
                      {formatDate(prescription.createdAt)}
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end mt-2 mt-md-0">
                    <span className="badge bg-success p-2">
                      <i className="bi bi-check-circle me-1"></i>
                      Active
                    </span>
                  </div>
                </div>

                <hr />

                {/* Diagnosis */}
                {prescription.diagnosis && (
                  <div className="mb-3">
                    <h6 className="fw-bold text-success">
                      <i className="bi bi-clipboard-pulse me-2"></i>
                      Diagnosis:
                    </h6>
                    <p className="mb-0">{prescription.diagnosis}</p>
                  </div>
                )}

                {/* Medicines */}
                <div className="mb-3">
                  <h6 className="fw-bold text-success">
                    <i className="bi bi-capsule me-2"></i>
                    Prescribed Medicines:
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                          <th>Instructions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescription.medicines.map((med, idx) => (
                          <tr key={idx}>
                            <td className="fw-bold">{med.medicineName}</td>
                            <td>{med.dosage}</td>
                            <td>{med.frequency}</td>
                            <td>{med.duration}</td>
                            <td>
                              <small className="text-muted">
                                {med.instructions || '-'}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Notes */}
                {prescription.additionalNotes && (
                  <div className="mb-3">
                    <h6 className="fw-bold text-success">
                      <i className="bi bi-sticky me-2"></i>
                      Additional Notes:
                    </h6>
                    <p className="mb-0 text-muted">{prescription.additionalNotes}</p>
                  </div>
                )}

                {/* Follow-up Date */}
                {prescription.followUpDate && (
                  <div className="alert alert-warning mb-0">
                    <i className="bi bi-calendar-check me-2"></i>
                    <strong>Follow-up:</strong> {formatDate(prescription.followUpDate)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-5">
              <i className="bi bi-file-medical" style={{ fontSize: '4rem' }}></i>
              <p className="mt-3">No prescriptions available</p>
              <p>Prescriptions from your doctors will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPrescriptionsPage;