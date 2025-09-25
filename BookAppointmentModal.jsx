// Import the React library and necessary hooks
import React, { useState } from 'react';
import './App.css';

// Define the functional component for the appointment booking modal
const BookAppointmentModal = ({ doctorName, onClose }) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'Video Call',
    symptoms: '',
  });

  // State to store form validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to validate the form
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required.";
      isValid = false;
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = "Preferred date is required.";
      isValid = false;
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = "Preferred time is required.";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Appointment booked:", formData);
      alert("Appointment booked successfully!");
      onClose(); // Close the modal on successful submission
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-custom">
        <div className="modal-header-custom">
          <h5 className="modal-title-custom">Book Appointment with {doctorName}</h5>
          <button type="button" className="close-button-custom" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="modal-body-custom">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Patient Information Section */}
              <div className="col-md-6">
                <h6 className="fw-bold text-success mb-3">Patient Information</h6>
                <div className="mb-3">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} name="fullName" value={formData.fullName} onChange={handleChange} />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} name="phone" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Age *</label>
                  <input type="number" className={`form-control ${errors.age ? 'is-invalid' : ''}`} name="age" value={formData.age} onChange={handleChange} />
                  {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender *</label>
                  <select className={`form-select ${errors.gender ? 'is-invalid' : ''}`} name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>
              </div>

              {/* Appointment Details Section */}
              <div className="col-md-6">
                <h6 className="fw-bold text-success mb-3">Appointment Details</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preferred Date *</label>
                    <input type="date" className={`form-control ${errors.preferredDate ? 'is-invalid' : ''}`} name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
                    {errors.preferredDate && <div className="invalid-feedback">{errors.preferredDate}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preferred Time *</label>
                    <input type="time" className={`form-control ${errors.preferredTime ? 'is-invalid' : ''}`} name="preferredTime" value={formData.preferredTime} onChange={handleChange} />
                    {errors.preferredTime && <div className="invalid-feedback">{errors.preferredTime}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Consultation Type *</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="consultationType" id="videoCall" value="Video Call" checked={formData.consultationType === 'Video Call'} onChange={handleChange} />
                      <label className="form-check-label" htmlFor="videoCall">Video Call</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="consultationType" id="textChat" value="Text Chat" checked={formData.consultationType === 'Text Chat'} onChange={handleChange} />
                      <label className="form-check-label" htmlFor="textChat">Text Chat</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="consultationType" id="both" value="Both" checked={formData.consultationType === 'Both'} onChange={handleChange} />
                      <label className="form-check-label" htmlFor="both">Both</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Symptoms/Reason for Visit</label>
                  <textarea className="form-control" rows="4" name="symptoms" value={formData.symptoms} onChange={handleChange}></textarea>
                  <small className="text-muted">Providing detailed symptoms helps the doctor prepare for your consultation.</small>
                </div>
              </div>
            </div>
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-success btn-lg">Book Now</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;