import React, { useState } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'donor'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = getFromStorage(STORAGE_KEYS.USERS);

    if (isLogin) {
      // ✅ LOGIN WITH ROLE CHECK
      const user = users.find(
        u =>
          u.email === formData.email &&
          u.password === formData.password &&
          u.role === formData.role
      );

      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email, password, or role selected');
      }
    } else {
      // ✅ SIGNUP
      if (users.find(u => u.email === formData.email)) {
        setError('Email already registered');
        return;
      }

      const newUser = {
        id: Date.now(),
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      saveToStorage(STORAGE_KEYS.USERS, users);
      onLogin(newUser);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>{isLogin ? 'Login' : 'Create Account'}</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={styles.input}
              />
            </div>
          )}

          {/* ✅ ROLE SELECT NOW IN LOGIN ALSO */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              style={styles.input}
            >
              <option value="donor">🎁 Donor</option>
              <option value="recipient">🤝 Recipient</option>
              <option value="logistics">🚚 Logistics</option>
              <option value="admin">⚙️ Admin</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.toggle}>
          {isLogin ? 'New user? ' : 'Already registered? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={styles.toggleButton}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#667eea'
  },
  formCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '1rem',
    width: '350px'
  },
  title: { textAlign: 'center', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '0.5rem' },
  input: {
    padding: '0.6rem',
    borderRadius: '0.5rem',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.8rem',
    borderRadius: '0.5rem',
    border: 'none',
    background: '#667eea',
    color: 'white',
    fontWeight: 'bold'
  },
  error: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    textAlign: 'center'
  },
  toggle: { textAlign: 'center', marginTop: '1rem' },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default AuthPage;