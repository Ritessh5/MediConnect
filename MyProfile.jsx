// Import the React library
import React from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

const MyProfile = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">{t('my_profile')}</h1>
        <p className="lead">{t('my_profile_subtitle')}</p>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <div className="text-center mb-4">
              <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                <i className="bi bi-person-fill" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="mt-3">John Doe</h4>
              <p className="text-muted">{t('joined_on')}: January 1, 2025</p>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-success mb-3">{t('personal_details')}</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">{t('email_address')}</label>
                  <p>johndoe@example.com</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">{t('phone_number')}</label>
                  <p>+91 6523181630</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">{t('gender')}</label>
                  <p>{t('male')}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">{t('date_of_birth')}</label>
                  <p>10/26/1990</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-bold">{t('address')}</label>
                  <p>Mumbai, Maharashtra-400003</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold text-success mb-3">{t('medical_history')}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('allergies')}
                  <span className="text-muted">{t('none')}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('current_medications')}
                  <span className="text-muted">{t('metformin')}</span>
                </li>
              </ul>
            </div>

            <div className="text-end mt-4">
              <button className="btn btn-outline-success">{t('edit_profile')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;