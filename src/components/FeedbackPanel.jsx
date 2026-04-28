import React, { useState } from 'react';
import { submitFeedback } from '../utils/api';

function FeedbackPanel({ user, role, moduleOptions = [], defaultModule }) {
  const [formData, setFormData] = useState({
    module: defaultModule || moduleOptions[0]?.id || 'general',
    rating: '5',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentEntry, setRecentEntry] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const selectedModule = moduleOptions.find((option) => option.id === formData.module);
    const payload = {
      role,
      module: formData.module,
      moduleLabel: selectedModule?.label || formData.module,
      rating: Number(formData.rating),
      message: formData.message,
      userName: user.name,
      userEmail: user.email
    };

    setIsSubmitting(true);
    setError('');
    setStatus('');

    try {
      const result = await submitFeedback(payload);
      setRecentEntry({
        ...payload,
        createdAt: new Date().toLocaleString()
      });
      setFormData((current) => ({
        ...current,
        rating: '5',
        message: ''
      }));
      setStatus(result.message || 'Feedback sent successfully.');
      setTimeout(() => setStatus(''), 2500);
    } catch (apiError) {
      setError(apiError.message || 'Could not send feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="section-card feedback-card">
      <div className="section-head">
        <div>
          <h2>Module feedback</h2>
          <p>Share what is working well or what should improve in this module.</p>
        </div>
        <span className="pill">Internal review</span>
      </div>

      <div className="dashboard-grid dashboard-grid--feedback">
        <form className="ops-form" onSubmit={handleSubmit}>
          <div className="ops-form__row ops-form__row--2">
            <select
              className="ops-input focus-outline"
              value={formData.module}
              onChange={(event) => setFormData((current) => ({ ...current, module: event.target.value }))}
            >
              {moduleOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
            <select
              className="ops-input focus-outline"
              value={formData.rating}
              onChange={(event) => setFormData((current) => ({ ...current, rating: event.target.value }))}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Needs work</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>
          <textarea
            className="ops-input ops-textarea focus-outline"
            rows="4"
            placeholder="Tell us what should be improved in this module..."
            required
            value={formData.message}
            onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
          />
          {error && <div className="status-banner error">{error}</div>}
          {status && <div className="status-banner success">{status}</div>}
          <button type="submit" className="primary-btn focus-outline" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit Feedback'}
          </button>
        </form>

        <div className="feedback-history">
          <div className="section-head">
            <div>
              <h2>Latest email</h2>
              <p>The most recent feedback sent from this screen.</p>
            </div>
          </div>

          <div className="record-list">
            {!recentEntry ? (
              <div className="empty-state">No feedback email has been sent from this screen yet.</div>
            ) : (
              <div className="record-row">
                <div>
                  <strong>{recentEntry.moduleLabel}</strong>
                  <p>{recentEntry.message}</p>
                </div>
                <div className="record-meta">
                  <span>{recentEntry.rating}/5</span>
                  <span>{recentEntry.userName}</span>
                  <span>{recentEntry.createdAt}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default FeedbackPanel;
