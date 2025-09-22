import React, { useState } from 'react';
import './App.css';

const ContactPage = () => {
  // 1. State for form inputs and validation errors
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    priority: 'low',
    message: ''
  });

  const [errors, setErrors] = useState({});

  // 2. Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // 3. Form validation logic
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }

    // Subject validation
    if (formData.subject === 'Select a subject' || !formData.subject) {
      newErrors.subject = "Please select a subject.";
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 4. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      console.log("Form Data:", formData);
      // Here you would typically send data to a backend API
    } else {
      console.log("Form has validation errors.");
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Contact MediConnect</h1>
        <p className="lead">Get in touch with our support team for any questions or assistance</p>
      </div>
      
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card p-4">
            <h4 className="mb-4">Send us a Message</h4>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      placeholder="Enter your first name" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Last Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder="Enter your last name" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email Address <span className="text-danger">*</span></label>
                    <input 
                      type="email" 
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email address" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="Enter your phone number" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Subject <span className="text-danger">*</span></label>
                <select 
                  className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing Question">Billing Question</option>
                </select>
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Priority Level</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="low" value="low" checked={formData.priority === 'low'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="low">LOW</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="medium" value="medium" checked={formData.priority === 'medium'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="medium">MEDIUM</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="high" value="high" checked={formData.priority === 'high'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="high">HIGH</label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Message <span className="text-danger">*</span></label>
                <textarea 
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  rows="4" 
                  placeholder="Type your message here..." 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100">Send Message</button>
            </form>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 h-100 bg-light">
            <h4 className="mb-4">Contact Information</h4>
            <ul className="list-unstyled">
              <li className="mb-3">
                <h6 className="fw-bold">Phone Support</h6>
                <p>1-800-MEDICONNECT<br/>Available 24/7</p>
              </li>
              <li className="mb-3">
                <h6 className="fw-bold">Email Support</h6>
                <p>support@mediconnect.com<br/>Response within 24 hours</p>
              </li>
              <li className="mb-3">
                <h6 className="fw-bold">Live Chat</h6>
                <p>Available on website<br/>Mon-Fri, 9 AM - 6 PM EST</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
