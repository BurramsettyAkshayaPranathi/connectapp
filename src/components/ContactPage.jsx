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
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title} className="fade-in">Contact Us</h1>
        <div style={styles.grid}>
          <div style={styles.card} className="fade-in">
            <h2 style={styles.cardTitle}>Get In Touch</h2>
            <div style={styles.contactList}>
              <div style={styles.contactItem}>
                <span style={styles.emoji}>📧</span>
                <div>
                  <p style={styles.contactLabel}>Email</p>
                  <p style={styles.contactValue}>support@reliefhub.org</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.emoji}>📞</span>
                <div>
                  <p style={styles.contactLabel}>Phone</p>
                  <p style={styles.contactValue}>8919910098</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.emoji}>📍</span>
                <div>
                  <p style={styles.contactLabel}>Address</p>
                  <p style={styles.contactValue}>123 Relief Street, City, State 12345</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.emoji}>⏰</span>
                <div>
                  <p style={styles.contactLabel}>Hours</p>
                  <p style={styles.contactValue}>24/7 Emergency Support</p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card} className="fade-in">
            <h2 style={styles.cardTitle}>Send a Message</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                  placeholder="Your name"
                  className="focus-outline"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={styles.input}
                  placeholder="your@email.com"
                  className="focus-outline"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="subject" style={styles.label}>Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  style={styles.input}
                  placeholder="How can we help?"
                  className="focus-outline"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="message" style={styles.label}>Message</label>
                <textarea
                  id="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{...styles.input, resize: 'none'}}
                  placeholder="Your message..."
                  className="focus-outline"
                />
              </div>
              {submitted && (
                <div style={styles.successMessage}>
                  Message sent successfully!
                </div>
              )}
              <button
                type="submit"
                style={styles.submitButton}
                className="focus-outline"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #faf5ff, #fdf2f8)',
    padding: '4rem 1.5rem'
  },
  content: {
    maxWidth: '56rem',
    margin: '0 auto'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    padding: '2rem'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#9333ea',
    marginBottom: '1.5rem'
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  emoji: {
    fontSize: '1.5rem'
  },
  contactLabel: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.25rem'
  },
  contactValue: {
    color: '#4b5563'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem'
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textAlign: 'center'
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#9333ea',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default ContactPage;