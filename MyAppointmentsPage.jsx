import React, { useState } from 'react';
import './App.css';

const specializationMap = {
  general_medicine: 'General Medicine',
  pediatrics: 'Pediatrics',
  cardiology: 'Cardiology',
};

const typeMap = {
  video_call: 'Video Call',
  text_chat: 'Text Chat',
};

const upcomingAppointments = [
  {
    doctorName: 'Dr. Sarah Johnson',
    specialization: specializationMap.general_medicine,
    date: 'October 5, 2025',
    time: '10:00 AM',
    type: typeMap.video_call,
  },
  {
    doctorName: 'Dr. Emily Chen',
    specialization: specializationMap.pediatrics,
    date: 'October 12, 2025',
    time: '02:30 PM',
    type: typeMap.text_chat,
  },
];

const previousAppointments = [
  {
    doctorName: 'Dr. David Lee',
    specialization: specializationMap.cardiology,
    date: 'September 20, 2025',
    time: '11:00 AM',
    type: typeMap.video_call,
  },
  {
    doctorName: 'Dr. Sarah Johnson',
    specialization: specializationMap.general_medicine,
    date: 'August 15, 2025',
    time: '04:00 PM',
    type: typeMap.video_call,
  },
];

const MyAppointmentsPage = () => {
  const [openSection, setOpenSection] = useState('upcoming');

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">My Appointments</h1>
        <p className="lead">View and manage your upcoming and past consultations.</p>
      </div>

      {/* Upcoming Appointments */}
      <div className="accordion mx-auto mb-4" style={{ maxWidth: '800px' }}>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${openSection === 'upcoming' ? '' : 'collapsed'}`}
              type="button"
              onClick={() => handleToggle('upcoming')}
            >
              Upcoming Appointments
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
                        <small className="text-muted">{appt.specialization}</small>
                      </div>
                      <span className="badge bg-success">{appt.type}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="mb-0">
                        <i className="bi bi-calendar-event me-2"></i>
                        {appt.date}
                      </p>
                      <p className="mb-0">
                        <i className="bi bi-clock me-2"></i>
                        {appt.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No upcoming appointments.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Appointments */}
      <div className="accordion mx-auto" style={{ maxWidth: '800px' }}>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${openSection === 'previous' ? '' : 'collapsed'}`}
              type="button"
              onClick={() => handleToggle('previous')}
            >
              Previous Appointments
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
                        <small className="text-muted">{appt.specialization}</small>
                      </div>
                      <span className="badge bg-secondary">{appt.type}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-center text-muted">
                      <p className="mb-0">
                        <i className="bi bi-calendar-event me-2"></i>
                        {appt.date}
                      </p>
                      <p className="mb-0">
                        <i className="bi bi-clock me-2"></i>
                        {appt.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No previous appointments.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
