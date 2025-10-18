// File: src/frontend/pages/ContactPage.jsx (Modified to remove i18n)

// Import the React library and necessary hooks
import React, { useState, useRef, useEffect } from 'react';
// import { useTranslation } from 'react-i18next'; // <-- REMOVED
import './App.css';

// Replaced key-based FAQ data with static questions and answers
const faqData = [
  {
    question: "How do I book an appointment?",
    answer: "You can book an appointment by navigating to the 'Find Doctors' page, selecting a doctor, and clicking the 'Book Consultation' button to open the scheduling modal."
  },
  {
    question: "What consultation types are available?",
    answer: "We offer consultations via Video Call, Text Chat, or a combination of both, depending on the doctor's availability and your preference."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we use industry-standard encryption and security protocols to ensure all your personal and health information is kept private and secure."
  },
  {
    question: "Can I search for medicines?",
    answer: "Yes, use the 'Medicine Search' feature in the navigation bar to find detailed information on various medicines."
  },
  {
    question: "How do I view my prescriptions?",
    answer: "Prescriptions are available on your 'My Prescriptions' page once they have been issued by a doctor following a consultation."
  },
  {
    question: "What should I do if I have a technical issue?",
    answer: "Please fill out the contact form below and select 'Technical Support' as the subject, or call our support line during business hours."
  }
];

const ContactPage = () => {
  // const { t } = useTranslation(); // <-- REMOVED

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
  const [openIndex, setOpenIndex] = useState(null);
  const faqRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    // NOTE: Validation messages replaced with static strings
    if (!formData.firstName.trim()) { newErrors.firstName = "First name is required."; isValid = false; }
    if (!formData.lastName.trim()) { newErrors.lastName = "Last name is required."; isValid = false; }
    if (!formData.email.trim()) { newErrors.email = "Email is required."; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = "Email address is invalid."; isValid = false; }
    if (formData.subject === 'Select a subject' || !formData.subject) { newErrors.subject = "Subject is required."; isValid = false; }
    if (!formData.message.trim()) { newErrors.message = "Message is required."; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!"); // NOTE: Alert message is static
      console.log("Form Data:", formData);
    } else {
      console.log("Form has validation errors.");
    }
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    if (faqRef.current) {
      const items = faqRef.current.querySelectorAll('.accordion-item');
      items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
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
      <div className="text-center mb-5">
        <h1 className="fw-bold">Contact MediConnect</h1> {/* Replaced t('contact_mediconnect') */}
        <p className="lead">We're here to help you with any questions or issues.</p> {/* Replaced t('contact_subtitle') */}
      </div>
      
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card p-4">
            <h4 className="mb-4">Send Us a Message</h4> {/* Replaced t('send_us_a_message') */}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name <span className="text-danger">*</span></label> {/* Replaced t('first_name') */}
                    <input type="text" className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} placeholder="Enter your first name" name="firstName" value={formData.firstName} onChange={handleChange} /> {/* Replaced t('enter_first_name') */}
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Last Name <span className="text-danger">*</span></label> {/* Replaced t('last_name') */}
                    <input type="text" className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} placeholder="Enter your last name" name="lastName" value={formData.lastName} onChange={handleChange} /> {/* Replaced t('enter_last_name') */}
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email Address <span className="text-danger">*</span></label> {/* Replaced t('email_address') */}
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Enter your email" name="email" value={formData.email} onChange={handleChange} /> {/* Replaced t('enter_email') */}
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label> {/* Replaced t('phone_number') */}
                    <input type="tel" className="form-control" placeholder="Enter your phone" name="phone" value={formData.phone} onChange={handleChange} /> {/* Replaced t('enter_phone') */}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Subject <span className="text-danger">*</span></label> {/* Replaced t('subject') */}
                <select className={`form-select ${errors.subject ? 'is-invalid' : ''}`} name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="">Select a subject</option> {/* Replaced t('select_a_subject') */}
                  <option value="General Inquiry">General Inquiry</option> {/* Replaced t('general_inquiry') */}
                  <option value="Technical Support">Technical Support</option> {/* Replaced t('technical_support') */}
                  <option value="Billing Question">Billing Question</option> {/* Replaced t('billing_question') */}
                </select>
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Priority Level</label> {/* Replaced t('priority_level') */}
                <div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="low" value="low" checked={formData.priority === 'low'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="low">Low</label> {/* Replaced t('low') */}
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="medium" value="medium" checked={formData.priority === 'medium'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="medium">Medium</label> {/* Replaced t('medium') */}
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="high" value="high" checked={formData.priority === 'high'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="high">High</label> {/* Replaced t('high') */}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Message <span className="text-danger">*</span></label> {/* Replaced t('message') */}
                <textarea className={`form-control ${errors.message ? 'is-invalid' : ''}`} rows="4" placeholder="Type your message here..." name="message" value={formData.message} onChange={handleChange}></textarea> {/* Replaced t('type_your_message') */}
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100">Send Message</button> {/* Replaced t('send_message') */}
            </form>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 h-100 bg-light">
            <h4 className="mb-4">Contact Information</h4> {/* Replaced t('contact_information') */}
            <ul className="list-unstyled">
              <li className="mb-3">
                <h6 className="fw-bold">Phone Support</h6> {/* Replaced t('phone_support') */}
                <p>+91 98765 43210<br/>Mon - Fri, 9:00 AM - 5:00 PM IST</p> {/* Replaced t('phone_number_value') and t('phone_support_hours') */}
              </li>
              <li className="mb-3">
                <h6 className="fw-bold">Email Support</h6> {/* Replaced t('email_support') */}
                <p>support@mediconnect.com<br/>We typically respond within 24 hours.</p> {/* Replaced t('email_address_value') and t('email_response_time') */}
              </li>
              <li className="mb-3">
                <h6 className="fw-bold">Live Chat</h6> {/* Replaced t('live_chat') */}
                <p>Chat is available on the homepage<br/>Mon - Sat, 10:00 AM - 8:00 PM IST</p> {/* Replaced t('live_chat_location') and t('live_chat_hours') */}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 text-center animate-fade-in">
        <h2 className="fw-bold">Frequently Asked Questions (FAQ)</h2> {/* Replaced t('faq_title') */}
        <p className="lead">Find quick answers to common questions.</p> {/* Replaced t('faq_subtitle') */}
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
                {item.question} {/* Replaced t(item.questionKey) */}
              </button>
            </h2>
            <div className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}>
              <div className="accordion-body">
                {item.answer} {/* Replaced t(item.answerKey) */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPage;