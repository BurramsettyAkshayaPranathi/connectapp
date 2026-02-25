import React from 'react';

function AboutPage() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title} className="fade-in">About Us</h1>
        <div style={styles.card} className="fade-in">
          <p style={styles.text}>
            Relief Donation Hub is a comprehensive platform designed to streamline emergency relief operations. 
            We connect donors, recipients, and logistics coordinators to ensure timely and efficient distribution 
            of essential supplies during crises.
          </p>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.text}>
            To create a transparent, efficient, and accessible system that bridges the gap between those who want 
            to help and those who need help during emergencies and natural disasters.
          </p>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.emoji}>👨‍💼</span>
              <div>
                <strong>Admins</strong> create and manage donation drives, ensuring transparency and accountability
              </div>
            </li>
            <li style={styles.listItem}>
              <span style={styles.emoji}>🤝</span>
              <div>
                <strong>Donors</strong> list available donations and track their contributions to various drives
              </div>
            </li>
            <li style={styles.listItem}>
              <span style={styles.emoji}>🏠</span>
              <div>
                <strong>Recipients</strong> submit requests for essential items and track delivery status
              </div>
            </li>
            <li style={styles.listItem}>
              <span style={styles.emoji}>🚚</span>
              <div>
                <strong>Logistics Coordinators</strong> manage transportation and ensure timely delivery
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #eff6ff, #faf5ff)',
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
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    padding: '2rem'
  },
  text: {
    fontSize: '1.125rem',
    color: '#374151',
    lineHeight: '1.75',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#9333ea',
    marginTop: '2rem',
    marginBottom: '1rem'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '1rem',
    color: '#374151'
  },
  emoji: {
    fontSize: '1.5rem'
  }
};

export default AboutPage;