import React from 'react';

function NavigationHeader({ currentPage, onNavigate, user, onLogout }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <h1 style={styles.logo}>Care Connect🤝</h1>
        </div>
        <div style={styles.rightSection}>
          <button
            onClick={() => onNavigate('home')}
            style={{
              ...styles.navButton,
              color: currentPage === 'home' ? '#9333ea' : '#4b5563'
            }}
            className="focus-outline"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            style={{
              ...styles.navButton,
              color: currentPage === 'about' ? '#9333ea' : '#4b5563'
            }}
            className="focus-outline"
          >
            About
          </button>
          <button
            onClick={() => onNavigate('contact')}
            style={{
              ...styles.navButton,
              color: currentPage === 'contact' ? '#9333ea' : '#4b5563'
            }}
            className="focus-outline"
          >
            Contact Us
          </button>
          {user && (
            <>
              <span style={styles.userName}>Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                style={styles.logoutButton}
                className="focus-outline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '1rem 1.5rem'
  },
  container: {
    maxWidth: '80rem',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#9333ea'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  navButton: {
    background: 'none',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.2s',
    fontSize: '1rem'
  },
  userName: {
    color: '#1f2937'
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

export default NavigationHeader;