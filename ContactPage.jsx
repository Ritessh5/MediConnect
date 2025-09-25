// Import the React library and the useState, useRef, and useEffect hooks
import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Hardcoded data for FAQ questions and answers
const faqData = [
  {
    question: "How do I book an appointment with a doctor?",
    answer: "You can book an appointment by navigating to the 'Find Doctors' page, selecting a doctor, and clicking the 'Book Consultation' button. You will then be prompted to fill out your patient details and preferred appointment time."
  },
  {
    question: "How does the medicine search feature work?",
    answer: "Our medicine search engine allows you to enter symptoms, medical conditions, or specific medicine names. The system will match your query with our comprehensive database and provide relevant medications with detailed information including dosage, side effects, and pricing."
  },
  {
    question: "Is my personal health information secure?",
    answer: "Yes, we prioritize the security of your personal and health information. We use industry-standard encryption protocols and comply with all relevant data privacy regulations to ensure your data is protected."
  },
  {
    question: "What types of consultations are available?",
    answer: "We offer various consultation types to suit your needs, including video calls, text chats, and a combination of both. You can select your preferred method when booking an appointment."
  },
  {
    question: "How much do consultations cost?",
    answer: "Consultation fees vary depending on the doctor's specialization and experience. The price for each doctor is clearly listed on their profile card on the 'Find Doctors' page."
  },
  {
    question: "Can I get prescriptions through online consultations?",
    answer: "Yes, if the doctor deems it necessary and appropriate for your condition, they can issue a digital prescription following a consultation. This prescription can be used at your local pharmacy."
  }
];

const ContactPage = () => {
  // State and functions for the contact form (no changes here)
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
  const handleChange = (e) => { /* ... (same as before) ... */ };
  const validateForm = () => { /* ... (same as before) ... */ };
  const handleSubmit = (e) => { /* ... (same as before) ... */ };
  
  // State and functions for the FAQ section
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  // Ref to the FAQ container for animation
  const faqRef = useRef(null);
  
  // useEffect to handle the "in view" animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is in view
    );
    
    // Observe each accordion item
    if (faqRef.current) {
      const items = faqRef.current.querySelectorAll('.accordion-item');
      items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`; // Stagger the animation
        observer.observe(item);
      });
    }

    return () => {
      if (faqRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="container py-5">
      {/* ... (Contact form and contact info section, same as before) ... */}
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

      {/* FAQ section with animation */}
      <div className="mt-5 pt-5 text-center animate-fade-in">
        <h2 className="fw-bold">Frequently Asked Questions</h2>
        <p className="lead">Find answers to common questions about MediConnect</p>
      </div>
      
      <div className="accordion mx-auto" ref={faqRef} style={{ maxWidth: '800px' }}>
        {faqData.map((item, index) => (
          <div key={index} className={`accordion-item animate-fade-in`}>
            <h2 className="accordion-header">
              <button 
                className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`} 
                type="button" 
                onClick={() => handleToggle(index)}
              >
                {item.question}
              </button>
            </h2>
            <div className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}>
              <div className="accordion-body">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component for use in other files
export default ContactPage;