import React from 'react';

function RoleSelectionPage({ user, onSelectRole }) {
  const allRoles = [
    {
      id: 'admin',
      title: 'Admin',
      icon: '⚙️',
      description: 'Manage donation drives and platform operations',
      color: '#f59e0b',
      bgColor: '#fff7ed'
    },
    {
      id: 'donor',
      title: 'Donor',
      icon: '🎁',
      description: 'List donations and track contributions',
      color: '#10b981',
      bgColor: '#f0fdf4'
    },
    {
      id: 'recipient',
      title: 'Recipient',
      icon: '🤝',
      description: 'Request essentials and track deliveries',
      color: '#ef4444',
      bgColor: '#fef2f2'
    },
    {
      id: 'logistics',
      title: 'Logistics',
      icon: '🚚',
      description: 'Coordinate deliveries and manage inventory',
      color: '#3b82f6',
      bgColor: '#eff6ff'
    }
  ];

  // ✅ Only admin can see all roles
  const availableRoles =
    user.role === 'admin'
      ? allRoles
      : allRoles.filter(role => role.id === user.role);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Welcome, {user.name}!</h1>
        <p style={styles.headerSubtitle}>
          {user.role === 'admin'
            ? 'Select any dashboard to access'
            : 'Access your dashboard'}
        </p>
      </header>

      <main style={styles.main}>
        <div style={styles.rolesGrid}>
          {availableRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              style={{
                ...styles.roleCard,
                backgroundColor: role.bgColor,
                borderLeft: `6px solid ${role.color}`
              }}
            >
              <div style={styles.roleIcon}>{role.icon}</div>
              <h2 style={{ color: role.color }}>{role.title}</h2>
              <p>{role.description}</p>
              <div style={{ ...styles.accessButton, backgroundColor: role.color }}>
                Access Dashboard →
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f3f4f6' },
  header: { padding: '2rem', textAlign: 'center' },
  headerTitle: { fontSize: '2rem', fontWeight: 'bold' },
  headerSubtitle: { color: '#6b7280' },
  main: { padding: '2rem' },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  roleCard: {
    padding: '2rem',
    borderRadius: '1rem',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center'
  },
  roleIcon: { fontSize: '3rem' },
  accessButton: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    color: 'white',
    fontWeight: '600'
  }
};

export default RoleSelectionPage;