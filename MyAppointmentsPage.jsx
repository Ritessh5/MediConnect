import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { appointmentAPI } from '@api/api.js'; // Corrected Alias Import
import './App.css';

const MyAppointmentsPage = () => {
  const navigate = useNavigate(); // ✅ FIX: Hook called inside the component
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getMyAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to load appointments. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await appointmentAPI.cancelAppointment(appointmentId, reason);
      alert('Appointment cancelled successfully');
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel appointment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // Get HH:MM from HH:MM:SS
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-primary';
      case 'confirmed': return 'bg-success';
      case 'completed': return 'bg-secondary';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-info';
    }
  };

  // Separate appointments into upcoming and previous
  const upcomingAppointments = appointments.filter(appt => 
    ['scheduled', 'confirmed'].includes(appt.status)
  );

  const previousAppointments = appointments.filter(appt => 
    ['completed', 'cancelled', 'no-show'].includes(appt.status)
  );

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5 animate-fade-in">
        <h1 className="fw-bold">My Appointments</h1>
        <p className="lead">View and manage your appointments</p>
      </div>

      {/* Upcoming Appointments Accordion */}
      <div className="accordion mx-auto mb-4" style={{ maxWidth: '800px' }}>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${openSection === 'upcoming' ? '' : 'collapsed'}`} 
              type="button" 
              onClick={() => handleToggle('upcoming')}
            >
              Upcoming Appointments ({upcomingAppointments.length})
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${openSection === 'upcoming' ? 'show' : ''}`}>
            <div className="accordion-body">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="card mb-3 p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-1">
                          Dr. {appt.doctor.user.username}
                        </h6>
                        <small className="text-muted">
                          {appt.doctor.specialization} • {appt.doctor.degree}
                        </small>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(appt.status)}`}>
                        {appt.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="row g-2">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <i className="bi bi-calendar-event me-2 text-success"></i>
                          <strong>Date:</strong> {formatDate(appt.appointmentDate)}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-clock me-2 text-success"></i>
                          <strong>Time:</strong> {formatTime(appt.appointmentTime)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <i className="bi bi-chat-square-dots me-2 text-success"></i>
                          <strong>Type:</strong> {appt.consultationType}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-currency-rupee me-2 text-success"></i>
                          <strong>Fee:</strong> ₹{appt.fee}
                        </p>
                      </div>
                    </div>

                    {appt.symptoms && (
                      <div className="mt-2">
                        <p className="mb-0">
                          <strong>Symptoms:</strong>
                          <br />
                          <small className="text-muted">{appt.symptoms}</small>
                        </p>
                      </div>
                    )}

                    <div className="mt-3 d-flex gap-2">
                        {appt.status === 'confirmed' && appt.consultationType !== 'Text Chat' && (
                          <button 
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => navigate(`/video-call?appointmentId=${appt.id}&doctorName=${appt.doctor.user.username}`)}
                          >
                            <i className="bi bi-camera-video me-1"></i>
                            Join Video Call
                          </button>
                        )}

                        {appt.status === 'scheduled' && (
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelAppointment(appt.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancel Appointment
                            </button>
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">
                  No upcoming appointments.
                </p>
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
              Previous Appointments ({previousAppointments.length})
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${openSection === 'previous' ? 'show' : ''}`}>
            <div className="accordion-body">
              {previousAppointments.length > 0 ? (
                previousAppointments.map((appt) => (
                  <div key={appt.id} className="card mb-3 p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-1">
                          Dr. {appt.doctor.user.username}
                        </h6>
                        <small className="text-muted">
                          {appt.doctor.specialization} • {appt.doctor.degree}
                        </small>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(appt.status)}`}>
                        {appt.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <hr className="my-2" />
                    
                    <div className="row g-2 text-muted">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <i className="bi bi-calendar-event me-2"></i>
                          {formatDate(appt.appointmentDate)}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-clock me-2"></i>
                          {formatTime(appt.appointmentTime)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <i className="bi bi-chat-square-dots me-2"></i>
                          {appt.consultationType}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-currency-rupee me-2"></i>
                          ₹{appt.fee}
                        </p>
                      </div>
                    </div>

                    {appt.cancelReason && (
                      <div className="mt-2">
                        <p className="mb-0 text-danger">
                          <strong>Cancellation Reason:</strong>
                          <br />
                          <small>{appt.cancelReason}</small>
                        </p>
                      </div>
                    )}

                    {appt.consultationNotes && (
                      <div className="mt-2">
                        <p className="mb-0">
                          <strong>Doctor's Notes:</strong>
                          <br />
                          <small className="text-muted">{appt.consultationNotes}</small>
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">
                  No previous appointments.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;