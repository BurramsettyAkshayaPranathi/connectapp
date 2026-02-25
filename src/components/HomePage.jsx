import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.hero} className="fade-in">
          <h1 style={styles.title}>Care Connect</h1>
          <p style={styles.subtitle}>
            Connecting donors, recipients, and logistics for emergency relief
          </p>
          <button
            onClick={() => onNavigate('auth')}
            style={styles.ctaButton}
            className="focus-outline"
          >
            Get Started
          </button>
        </div>

        <div style={styles.grid}>
          <div style={styles.card} className="slide-in">
            <div style={styles.icon}>👨‍💼</div>
            <h3 style={styles.cardTitle}>Admin</h3>
            <p style={styles.cardText}>Manage drives and oversee operations</p>
          </div>
          <div style={{...styles.card, animationDelay: '0.1s'}} className="slide-in">
            <div style={styles.icon}>🤝</div>
            <h3 style={styles.cardTitle}>Donor</h3>
            <p style={styles.cardText}>List donations and support drives</p>
          </div>
          <div style={{...styles.card, animationDelay: '0.2s'}} className="slide-in">
            <div style={styles.icon}>🏠</div>
            <h3 style={styles.cardTitle}>Recipient</h3>
            <p style={styles.cardText}>Request essentials and track deliveries</p>
          </div>
          <div style={{...styles.card, animationDelay: '0.3s'}} className="slide-in">
            <div style={styles.icon}>🚚</div>
            <h3 style={styles.cardTitle}>Logistics</h3>
            <p style={styles.cardText}>Coordinate transport and deliveries</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #faf5ff, #eff6ff)'
  },
  content: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '4rem 1.5rem'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '4rem'
  },
  title: {
    fontSize: '3.75rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#4b5563',
    marginBottom: '2rem'
  },
  ctaButton: {
    backgroundColor: '#9333ea',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    transform: 'scale(1)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '4rem'
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  cardText: {
    color: '#4b5563'
  }
};

export default HomePage;