import { useState } from 'react';
import './App.css';

import NavigationHeader from './components/NavigationHeader';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AuthPage from './components/AuthPage';

import AdminDashboard from './components/AdminDashboard';
import DonorDashboard from './components/DonorDashboard';
import RecipientDashboard from './components/RecipientDashboard';
import LogisticsDashboard from './components/LogisticsDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  // Navigation
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard'); // 🔥 Directly go to dashboard
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  // Hide navigation on auth and dashboard
  const showNavigation =
    currentPage !== 'auth' &&
    currentPage !== 'dashboard';

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

      {/* Static Pages */}
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}

      {currentPage === 'about' && <AboutPage />}

      {currentPage === 'contact' && <ContactPage />}

      {currentPage === 'auth' && (
        <AuthPage
          onLogin={handleLogin}
          onBack={() => setCurrentPage('home')}
        />
      )}

      {/* 🔐 Role-Based Dashboards */}
      {currentPage === 'dashboard' && currentUser?.role === 'admin' && (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'dashboard' && currentUser?.role === 'donor' && (
        <DonorDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'dashboard' && currentUser?.role === 'recipient' && (
        <RecipientDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'dashboard' && currentUser?.role === 'logistics' && (
        <LogisticsDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}

export default App;
