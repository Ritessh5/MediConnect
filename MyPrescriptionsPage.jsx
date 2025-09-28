// Import the React library
import React from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

// Hardcoded data for user's prescriptions
const prescriptions = [
  {
    doctorName: 'Dr. Sarah Johnson',
    specializationKey: 'general_medicine',
    date: 'Sep 25, 2025',
    medicine: 'Ibuprofen (Advil)',
    dosage: '200mg, twice a day',
  },
  {
    doctorName: 'Dr. Emily Chen',
    specializationKey: 'pediatrics',
    date: 'Sep 10, 2025',
    medicine: 'Amoxicillin',
    dosage: '250mg, three times a day',
  },
  {
    doctorName: 'Dr. David Lee',
    specializationKey: 'cardiology',
    date: 'Aug 20, 2025',
    medicine: 'Lisinopril',
    dosage: '10mg, once a day',
  },
];

const MyPrescriptionsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">{t('my_prescriptions')}</h1>
        <p className="lead">{t('my_prescriptions_subtitle')}</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription, index) => (
              <div key={index} className="card p-4 mb-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="fw-bold">{prescription.medicine}</h5>
                    <p className="text-muted mb-1">{t('prescribed_by')}: {prescription.doctorName} ({t(prescription.specializationKey)})</p>
                    <p className="text-muted mb-0">{t('date')}: {prescription.date}</p>
                    <p className="mb-0">{t('dosage')}: **{t(prescription.dosageKey)}**</p>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <button className="btn btn-success me-2">
                      <i className="bi bi-file-earmark-arrow-down me-2"></i> {t('download')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">
              <p>{t('no_prescriptions_on_record')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPrescriptionsPage;