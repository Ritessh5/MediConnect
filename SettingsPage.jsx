// Import the React library
import React from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">{t('settings')}</h1>
        <p className="lead">{t('settings_subtitle')}</p>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <div className="mb-4 pb-4 border-bottom">
              <h5 className="fw-bold text-success mb-3">{t('account_settings')}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('update_profile_info')}
                  <i className="bi bi-chevron-right text-muted"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('change_password')}
                  <i className="bi bi-chevron-right text-muted"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('manage_payment_methods')}
                  <i className="bi bi-chevron-right text-muted"></i>
                </li>
              </ul>
            </div>

            <div className="mb-4 pb-4 border-bottom">
              <h5 className="fw-bold text-success mb-3">{t('notification_preferences')}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('email_notifications')}
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="emailSwitch" defaultChecked />
                  </div>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('sms_notifications')}
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="smsSwitch" />
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="fw-bold text-success mb-3">{t('privacy_and_security')}</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('privacy_policy')}
                  <i className="bi bi-chevron-right text-muted"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {t('delete_account')}
                  <i className="bi bi-chevron-right text-danger"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;