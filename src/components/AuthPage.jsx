import React, { useState } from 'react';
import { loginUser, resendSignupOtp, signupUser, verifySignupOtp } from '../utils/api';

const roleOptions = [
  { value: 'donor', label: 'Donor', desc: 'List supplies and support drives' },
  { value: 'recipient', label: 'Recipient', desc: 'Request essentials and track support' },
  { value: 'logistics', label: 'Logistics', desc: 'Coordinate transport and delivery' },
  { value: 'admin', label: 'Admin', desc: 'Oversee platform operations' }
];

function AuthPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'donor'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const action = isLogin
      ? loginUser({
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      : signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

    action
      .then((result) => {
        if (isLogin) {
          onLogin(result);
          return;
        }

        setSuccess(result.message || '');
        setPendingVerificationEmail(formData.email);
        setVerificationEmail(formData.email);
        setOtp('');
        setIsOtpStep(true);
        setFormData((current) => ({
          ...current,
          password: ''
        }));
      })
      .catch((apiError) => {
        setError(apiError.message || 'Something went wrong');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const switchMode = (nextIsLogin) => {
    setIsLogin(nextIsLogin);
    setIsOtpStep(false);
    setError('');
    setSuccess('');
    setPendingVerificationEmail('');
    setVerificationEmail('');
    setOtp('');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    verifySignupOtp({
      email: verificationEmail || pendingVerificationEmail || formData.email,
      otp
    })
      .then((result) => {
        setSuccess(result.message || 'Registration successful. You can log in now.');
        setPendingVerificationEmail('');
        setVerificationEmail('');
        setOtp('');
        setIsOtpStep(false);
        setIsLogin(true);
      })
      .catch((apiError) => {
        setError(apiError.message || 'OTP verification failed');
      });
  };

  const handleResendOtp = () => {
    const email = verificationEmail || pendingVerificationEmail || formData.email;
    if (!email) {
      setError('Enter the signup email first.');
      return;
    }

    setError('');
    setSuccess('');
    setIsResendingOtp(true);

    resendSignupOtp({ email })
      .then((result) => {
        setSuccess(result.message || 'A new OTP has been sent to your email.');
        setOtp('');
      })
      .catch((apiError) => {
        setError(apiError.message || 'Could not resend OTP');
      })
      .finally(() => {
        setIsResendingOtp(false);
      });
  };

  return (
    <>
      <section className="auth-page page-shell fade-in">
        <div className="auth-layout">
          <aside className="auth-intro glass-panel">
            <span className="eyebrow">Secure Role Access</span>
            <h1 className="page-title">
              {isOtpStep ? 'Enter OTP sent to your mail.' : isLogin ? 'Return to your relief workspace.' : 'Create a verified role-based account.'}
            </h1>
            <p className="page-copy">
              {isOtpStep
                ? `Enter the 6-digit OTP sent to ${pendingVerificationEmail}. Your account will be created only after this verification succeeds.`
                : 'Sign in with the same backend and database you already have. New accounts must verify their email before accessing a dashboard.'}
            </p>

            <div className="auth-role-list">
              {roleOptions.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  className={`auth-role focus-outline ${formData.role === role.value ? 'is-active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: role.value })}
                >
                  <strong>{role.label}</strong>
                  <span>{role.desc}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="section-card auth-card">
            <div className="auth-topbar">
              <button type="button" className="ghost-btn focus-outline" onClick={onBack}>
                Back to Home
              </button>
            </div>

            {!isOtpStep && (
            <div className="auth-switch">
              <button
                type="button"
                className={`focus-outline ${isLogin ? 'is-active' : ''}`}
                onClick={() => switchMode(true)}
              >
                Login
              </button>
              <button
                type="button"
                className={`focus-outline ${!isLogin ? 'is-active' : ''}`}
                onClick={() => switchMode(false)}
              >
                Sign Up
              </button>
            </div>
            )}

            {!isOtpStep ? (
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="auth-input focus-outline"
                />
              )}

              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="auth-input focus-outline"
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  const email = e.target.value;
                  setFormData({ ...formData, email });
                  if (!pendingVerificationEmail) {
                    setVerificationEmail(email);
                  }
                }}
                placeholder="Email"
                className="auth-input focus-outline"
              />

              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="auth-input focus-outline"
              />

              {success && !pendingVerificationEmail && <div className="status-banner success">{success}</div>}
              {error && !pendingVerificationEmail && <div className="status-banner error">{error}</div>}

              <button type="submit" className="primary-btn focus-outline auth-submit" disabled={isSubmitting}>
                {isSubmitting ? (isLogin ? 'Opening...' : 'Registering...') : (isLogin ? 'Open Dashboard' : 'Register')}
              </button>
            </form>
            ) : (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              {error && <div className="status-banner error">{error}</div>}

              <input
                type="email"
                required
                value={verificationEmail}
                onChange={(e) => setVerificationEmail(e.target.value)}
                placeholder="Email used for signup"
                className="auth-input focus-outline"
              />

              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="auth-input focus-outline"
              />

              <button
                type="button"
                className="ghost-btn focus-outline auth-secondary"
                onClick={handleResendOtp}
                disabled={isResendingOtp}
              >
                {isResendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>

              <button type="submit" className="primary-btn focus-outline auth-submit">
                Verify OTP
              </button>
            </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .auth-page {
          min-height: 100vh;
          padding: 6px 0;
          display: flex;
        }

        .auth-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          align-items: stretch;
          min-height: calc(100vh - 12px);
        }

        .auth-intro,
        .auth-card {
          border-radius: 0;
          padding: 28px;
          min-height: 100%;
        }

        .auth-intro h1 {
          font-size: clamp(2.1rem, 4vw, 3.6rem);
          margin: 18px 0 14px;
        }

        .auth-role-list {
          display: grid;
          gap: 12px;
          margin-top: 26px;
        }

        .auth-role {
          text-align: left;
          border-radius: 0;
          padding: 16px 18px;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.75);
        }

        .auth-role.is-active {
          border-color: rgba(15, 118, 110, 0.3);
          background: rgba(15, 118, 110, 0.1);
        }

        .auth-role span {
          display: block;
          margin-top: 6px;
          color: var(--text-soft);
        }

        .auth-switch {
          display: inline-grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          background: var(--surface-muted);
          border-radius: 0;
          padding: 6px;
          margin-bottom: 20px;
          gap: 4px;
        }

        .auth-topbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }

        .auth-switch button {
          border: none;
          background: transparent;
          border-radius: 0;
          padding: 10px 18px;
          font-weight: 700;
          color: var(--text-soft);
        }

        .auth-switch button.is-active {
          background: white;
          color: var(--primary-strong);
          box-shadow: var(--shadow-sm);
        }

        .auth-form {
          display: grid;
          gap: 14px;
        }

        .auth-input {
          width: 100%;
          border: 1px solid var(--line-strong);
          border-radius: 0;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.86);
        }

        .auth-submit {
          width: 100%;
        }

        .auth-submit:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .auth-secondary {
          width: 100%;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .auth-layout {
            grid-template-columns: 1fr;
            min-height: auto;
          }
        }
      `}</style>
    </>
  );
}

export default AuthPage;
