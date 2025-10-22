import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '@api/api.js'; // Corrected Alias Import
import '../../pages/App.css';

const BookAppointmentModal = ({ doctor, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    consultationType: doctor.isVideoCallAvailable ? 'Video Call' : 'Text Chat',
    symptoms: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required.";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.appointmentDate = "Cannot book appointment in the past.";
        isValid = false;
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Appointment time is required.";
      isValid = false;
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = "Please describe your symptoms.";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        doctorId: doctor.id,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime + ':00',
        consultationType: formData.consultationType,
        symptoms: formData.symptoms
      };

      const response = await appointmentAPI.bookAppointment(appointmentData);

      if (response.status === 'success') {
        alert('Appointment booked successfully! 🎉');
        onClose();
        navigate('/my-appointments');
      }
    } catch (error) {
      console.error('Booking error:', error);
      if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-custom">
        <div className="modal-header-custom">
          <h5 className="modal-title-custom">
            Book Appointment with {doctor.user.username}
          </h5>
          <button 
            type="button" 
            className="close-button-custom" 
            onClick={onClose}
            disabled={loading}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="modal-body-custom">
          <div className="alert alert-info mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{doctor.specialization}</strong>
                <br />
                <small>{doctor.degree} • {doctor.experience} years exp</small>
              </div>
              <div className="text-end">
                <h5 className="mb-0 text-success">₹{doctor.consultationFee}</h5>
                <small className="text-muted">Consultation Fee</small>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-12">
                <h6 className="fw-bold text-success mb-3">Appointment Details</h6>
              </div>

              <div className="col-md-6">
                <label className="form-label">Appointment Date *</label>
                <input 
                  type="date" 
                  className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  disabled={loading}
                />
                {errors.appointmentDate && (
                  <div className="invalid-feedback">{errors.appointmentDate}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Appointment Time *</label>
                <input 
                  type="time" 
                  className={`form-control ${errors.appointmentTime ? 'is-invalid' : ''}`}
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.appointmentTime && (
                  <div className="invalid-feedback">{errors.appointmentTime}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Consultation Type *</label>
                <div>
                  {doctor.isVideoCallAvailable && (
                    <div className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="consultationType"
                        id="videoCall"
                        value="Video Call"
                        checked={formData.consultationType === 'Video Call'}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="videoCall">
                        <i className="bi bi-camera-video me-1"></i> Video Call
                      </label>
                    </div>
                  )}
                  {doctor.isChatAvailable && (
                    <div className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="consultationType"
                        id="textChat"
                        value="Text Chat"
                        checked={formData.consultationType === 'Text Chat'}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="textChat">
                        <i className="bi bi-chat-dots me-1"></i> Text Chat
                      </label>
                    </div>
                  )}
                  {doctor.isVideoCallAvailable && doctor.isChatAvailable && (
                    <div className="form-check form-check-inline">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="consultationType"
                        id="both"
                        value="Both"
                        checked={formData.consultationType === 'Both'}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="both">
                        <i className="bi bi-plus-circle me-1"></i> Both
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">Symptoms/Reason for Visit *</label>
                <textarea 
                  className={`form-control ${errors.symptoms ? 'is-invalid' : ''}`}
                  rows="4"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms in detail..."
                  disabled={loading}
                ></textarea>
                {errors.symptoms && (
                  <div className="invalid-feedback">{errors.symptoms}</div>
                )}
                <small className="text-muted">
                  Providing detailed symptoms helps the doctor prepare for your consultation.
                </small>
              </div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <button 
                type="submit" 
                className="btn btn-success btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Booking...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar-check me-2"></i>
                    Book Appointment - ₹{doctor.consultationFee}
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;