import { useState } from 'react';
import './App.css';

import NavigationHeader from './components/NavigationHeader';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AuthPage from './components/AuthPage';
import RoleSelectionPage from './components/RoleSelectionPage';

import AdminDashboard from './components/AdminDashboard';
import DonorDashboard from './components/DonorDashboard';
import RecipientDashboard from './components/RecipientDashboard';
import LogisticsDashboard from './components/LogisticsDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Navigation handler
  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      setSelectedRole(null);
    }
  };

  // Login handler
  const handleLogin = (user) => {
    setCurrentUser(user);

    if (user.role === 'admin') {
      setCurrentPage('roleSelection');
    } else {
      setSelectedRole(user.role);
      setCurrentPage('dashboard');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    setCurrentPage('home');
  };

  // Admin role selection
  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setCurrentPage('dashboard');
  };

  // Hide navigation during dashboard and auth
  const showNavigation =
    currentPage !== 'auth' &&
    currentPage !== 'dashboard' &&
    currentPage !== 'roleSelection';

  return (
    <div className="app-container">

      {/* Navigation */}
      {showNavigation && (
        <NavigationHeader
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Pages */}
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}

      {currentPage === 'about' && <AboutPage />}

      {currentPage === 'contact' && <ContactPage />}

      {currentPage === 'auth' && (
        <AuthPage onLogin={handleLogin} />
      )}

      {/* Admin Role Selection */}
      {currentPage === 'roleSelection' &&
        currentUser?.role === 'admin' && (
          <RoleSelectionPage
            user={currentUser}
            onSelectRole={handleSelectRole}
          />
        )}

      {/* Dashboards */}
      {currentPage === 'dashboard' && selectedRole === 'admin' && (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'dashboard' && selectedRole === 'donor' && (
        <DonorDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'dashboard' && selectedRole === 'recipient' && (
        <RecipientDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'dashboard' && selectedRole === 'logistics' && (
        <LogisticsDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}

export default App;