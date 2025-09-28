// Import the React library and necessary hooks
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

// Hardcoded data for upcoming appointments
const upcomingAppointments = [
  {
    doctorName: 'Dr. Sarah Johnson',
    specializationKey: 'general_medicine',
    date: 'October 5, 2025',
    time: '10:00 AM',
    typeKey: 'video_call',
  },
  {
    doctorName: 'Dr. Emily Chen',
    specializationKey: 'pediatrics',
    date: 'October 12, 2025',
    time: '02:30 PM',
    typeKey: 'text_chat',
  },
];

// Hardcoded data for previous appointments
const previousAppointments = [
  {
    doctorName: 'Dr. David Lee',
    specializationKey: 'cardiology',
    date: 'September 20, 2025',
    time: '11:00 AM',
    typeKey: 'video_call',
  },
  {
    doctorName: 'Dr. Sarah Johnson',
    specializationKey: 'general_medicine',
    date: 'August 15, 2025',
    time: '04:00 PM',
    typeKey: 'video_call',
  },
];

const MyAppointmentsPage = () => {
  const { t } = useTranslation();
  const [openSection, setOpenSection] = useState('upcoming');

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">{t('my_appointments')}</h1>
        <p className="lead">{t('my_appointments_subtitle')}</p>
      </div>

      <div className="accordion mx-auto mb-4" style={{ maxWidth: '800px' }}>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${openSection === 'upcoming' ? '' : 'collapsed'}`} 
              type="button" 
              onClick={() => handleToggle('upcoming')}
            >
              {t('upcoming_appointments')}
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${openSection === 'upcoming' ? 'show' : ''}`}>
            <div className="accordion-body">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt, index) => (
                  <div key={index} className="card mb-3 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-0">{appt.doctorName}</h6>
                        <small className="text-muted">{t(appt.specializationKey)}</small>
                      </div>
                      <span className="badge bg-success">{t(appt.typeKey)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0"><i className="bi bi-calendar-event me-2"></i>{appt.date}</p>
                      <p className="mb-0"><i className="bi bi-clock me-2"></i>{appt.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">{t('no_upcoming_appointments')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="accordion mx-auto" style={{ maxWidth: '800px' }}>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${openSection === 'previous' ? '' : 'collapsed'}`} 
              type="button" 
              onClick={() => handleToggle('previous')}
            >
              {t('previous_appointments')}
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${openSection === 'previous' ? 'show' : ''}`}>
            <div className="accordion-body">
              {previousAppointments.length > 0 ? (
                previousAppointments.map((appt, index) => (
                  <div key={index} className="card mb-3 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-0">{appt.doctorName}</h6>
                        <small className="text-muted">{t(appt.specializationKey)}</small>
                      </div>
                      <span className="badge bg-secondary">{t(appt.typeKey)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-center text-muted">
                      <p className="mb-0"><i className="bi bi-calendar-event me-2"></i>{appt.date}</p>
                      <p className="mb-0"><i className="bi bi-clock me-2"></i>{appt.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">{t('no_previous_appointments')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;