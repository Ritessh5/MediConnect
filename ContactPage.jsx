// Import the React library and necessary hooks
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

// Hardcoded data for FAQ questions and answers
const faqData = [
  {
    questionKey: "faq_q1",
    answerKey: "faq_a1"
  },
  {
    questionKey: "faq_q2",
    answerKey: "faq_a2"
  },
  {
    questionKey: "faq_q3",
    answerKey: "faq_a3"
  },
  {
    questionKey: "faq_q4",
    answerKey: "faq_a4"
  },
  {
    questionKey: "faq_q5",
    answerKey: "faq_a5"
  },
  {
    questionKey: "faq_q6",
    answerKey: "faq_a6"
  }
];

const ContactPage = () => {
  const { t } = useTranslation();
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
    if (!formData.firstName.trim()) { newErrors.firstName = t("first_name_required"); isValid = false; }
    if (!formData.lastName.trim()) { newErrors.lastName = t("last_name_required"); isValid = false; }
    if (!formData.email.trim()) { newErrors.email = t("email_required"); isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = t("email_invalid"); isValid = false; }
    if (formData.subject === 'Select a subject' || !formData.subject) { newErrors.subject = t("subject_required"); isValid = false; }
    if (!formData.message.trim()) { newErrors.message = t("message_required"); isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert(t("form_submitted_success"));
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
        <h1 className="fw-bold">{t('contact_mediconnect')}</h1>
        <p className="lead">{t('contact_subtitle')}</p>
      </div>
      
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card p-4">
            <h4 className="mb-4">{t('send_us_a_message')}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">{t('first_name')} <span className="text-danger">*</span></label>
                    <input type="text" className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} placeholder={t('enter_first_name')} name="firstName" value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">{t('last_name')} <span className="text-danger">*</span></label>
                    <input type="text" className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} placeholder={t('enter_last_name')} name="lastName" value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">{t('email_address')} <span className="text-danger">*</span></label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder={t('enter_email')} name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">{t('phone_number')}</label>
                    <input type="tel" className="form-control" placeholder={t('enter_phone')} name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">{t('subject')} <span className="text-danger">*</span></label>
                <select className={`form-select ${errors.subject ? 'is-invalid' : ''}`} name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="">{t('select_a_subject')}</option>
                  <option value="General Inquiry">{t('general_inquiry')}</option>
                  <option value="Technical Support">{t('technical_support')}</option>
                  <option value="Billing Question">{t('billing_question')}</option>
                </select>
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">{t('priority_level')}</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="low" value="low" checked={formData.priority === 'low'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="low">{t('low')}</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="medium" value="medium" checked={formData.priority === 'medium'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="medium">{t('medium')}</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="priority" id="high" value="high" checked={formData.priority === 'high'} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="high">{t('high')}</label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">{t('message')} <span className="text-danger">*</span></label>
                <textarea className={`form-control ${errors.message ? 'is-invalid' : ''}`} rows="4" placeholder={t('type_your_message')} name="message" value={formData.message} onChange={handleChange}></textarea>
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100">{t('send_message')}</button>
            </form>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 h-100 bg-light">
            <h4 className="mb-4">{t('contact_information')}</h4>
            <ul className="list-unstyled">
              <li className="mb-3">
                <h6 className="fw-bold">{t('phone_support')}</h6>
                <p>{t('phone_number_value')}<br/>{t('phone_support_hours')}</p>
              </li>
              <li className="mb-3">
                <h6 className="fw-bold">{t('email_support')}</h6>
                <p>{t('email_address_value')}<br/>{t('email_response_time')}</p>
              </li>
              <li className="mb-3">
                <h6 className="fw-bold">{t('live_chat')}</h6>
                <p>{t('live_chat_location')}<br/>{t('live_chat_hours')}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 text-center animate-fade-in">
        <h2 className="fw-bold">{t('faq_title')}</h2>
        <p className="lead">{t('faq_subtitle')}</p>
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
                {t(item.questionKey)}
              </button>
            </h2>
            <div className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}>
              <div className="accordion-body">
                {t(item.answerKey)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactPage;