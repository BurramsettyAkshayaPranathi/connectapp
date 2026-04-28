import React, { useState } from 'react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      <section className="contact-page page-shell fade-in">
        <div className="contact-head">
          <span className="eyebrow">Support & Coordination</span>
          <h1 className="page-title">Keep donors, field teams, and recipients connected during every drive.</h1>
          <p className="page-copy">
            Use this page as a support touchpoint for platform access, emergency coordination, or partnership inquiries.
          </p>
        </div>

        <div className="contact-grid">
          <article className="section-card contact-card">
            <h2>Operations desk</h2>
            <div className="contact-list">
              <div>
                <small>Email</small>
                <strong>support@careconnect.org</strong>
              </div>
              <div>
                <small>Phone</small>
                <strong>+91 89199 10098</strong>
              </div>
              <div>
                <small>Coordination center</small>
                <strong>Relief Operations Hub, Hyderabad</strong>
              </div>
              <div>
                <small>Availability</small>
                <strong>24/7 emergency support window</strong>
              </div>
            </div>
          </article>

          <article className="section-card contact-card">
            <h2>Send a message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="contact-input focus-outline"
              />
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
                className="contact-input focus-outline"
              />
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Subject"
                className="contact-input focus-outline"
              />
              <textarea
                id="message"
                required
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what you need"
                className="contact-input contact-textarea focus-outline"
              />
              {submitted && <div className="status-banner success">Message queued successfully.</div>}
              <button type="submit" className="primary-btn focus-outline">
                Send Message
              </button>
            </form>
          </article>
        </div>
      </section>

      <style>{`
        .contact-page {
          padding: 34px 0 54px;
        }

        .contact-head {
          max-width: 700px;
          margin-bottom: 26px;
        }

        .contact-head h1 {
          font-size: clamp(2.1rem, 5vw, 3.9rem);
          margin: 18px 0 12px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 22px;
        }

        .contact-card {
          padding: 26px;
        }

        .contact-card h2 {
          margin-bottom: 18px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .contact-list {
          display: grid;
          gap: 14px;
        }

        .contact-list div {
          padding: 16px;
          border-radius: var(--radius-md);
          background: rgba(247, 242, 232, 0.88);
          border: 1px solid var(--line);
        }

        .contact-list small {
          display: block;
          color: var(--text-faint);
          margin-bottom: 6px;
        }

        .contact-form {
          display: grid;
          gap: 14px;
        }

        .contact-input {
          width: 100%;
          border: 1px solid var(--line-strong);
          background: rgba(255, 255, 255, 0.85);
          border-radius: 16px;
          padding: 14px 16px;
        }

        .contact-textarea {
          resize: vertical;
          min-height: 130px;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default ContactPage;
