import React, { useEffect, useState } from 'react';
import { createRequest, fetchDrives, fetchRequestsByUser } from '../utils/api';
import DashboardShell from './DashboardShell';
import FeedbackPanel from './FeedbackPanel';
import FilterToolbar from './FilterToolbar';
import { buildFilterOptions, formatLabel, matchesSearch } from '../utils/dashboard';

const recipientModules = [
  { id: 'overview', label: 'Overview', description: 'Need summary and support status' },
  { id: 'request', label: 'Request Help', description: 'Submit a new support request' },
  { id: 'campaigns', label: 'Drives', description: 'Browse active matching drives' },
  { id: 'history', label: 'My Requests', description: 'Review submitted requests' }
];

function RecipientDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('overview');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    quantity: '',
    location: '',
    priority: 'high'
  });
  const [message, setMessage] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [drives, setDrives] = useState([]);
  const [error, setError] = useState('');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignCategory, setCampaignCategory] = useState('all');
  const [campaignPriority, setCampaignPriority] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [historyPriority, setHistoryPriority] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchRequestsByUser(user.email), fetchDrives()])
      .then(([requests, driveData]) => {
        if (isMounted) {
          setMyRequests(requests);
          setDrives(driveData);
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || 'Failed to load requests.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newRequest = await createRequest({
        ...formData,
        quantity: Number(formData.quantity) || 0,
        recipientName: user.name,
        createdByEmail: user.email
      });

      setMyRequests((currentRequests) => [newRequest, ...currentRequests]);
      setMessage('Request submitted successfully.');
      setError('');
      setFormData({
        title: '',
        description: '',
        category: 'food',
        quantity: '',
        location: '',
        priority: 'high'
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (apiError) {
      setError(apiError.message || 'Failed to submit request.');
    }
  };

  const openRequests = myRequests.filter((item) => formatLabel(item.status) === 'open').length;
  const criticalRequests = myRequests.filter((item) => formatLabel(item.priority) === 'high').length;
  const fulfilledRequests = myRequests.filter((item) => formatLabel(item.status) === 'fulfilled').length;
  const filteredDrives = drives.filter((drive) => (
    matchesSearch(drive, campaignSearch, ['title', 'description', 'location'])
    && (campaignCategory === 'all' || formatLabel(drive.category) === campaignCategory)
    && (campaignPriority === 'all' || formatLabel(drive.priority) === campaignPriority)
  ));
  const filteredRequests = myRequests.filter((request) => (
    matchesSearch(request, historySearch, ['title', 'description', 'location'])
    && (historyPriority === 'all' || formatLabel(request.priority) === historyPriority)
    && (historyStatus === 'all' || formatLabel(request.status) === historyStatus)
  ));

  const renderModule = () => {
    if (activeModule === 'request') {
      return (
        <>
          <article className="section-card workbench-card">
            <div className="section-head">
              <div>
                <h2>Submit a request</h2>
                <p>Describe the need, urgency, and delivery destination.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="ops-form">
              <input className="ops-input focus-outline" type="text" placeholder="What do you need most?" required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
              <textarea className="ops-input ops-textarea focus-outline" rows="4" placeholder="Additional details about the household or situation" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
              <div className="ops-form__row recipient-form-grid">
                <select className="ops-input focus-outline" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })}>
                  <option value="food">Food</option>
                  <option value="clothing">Clothing</option>
                  <option value="shelter">Shelter</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
                <input className="ops-input focus-outline" type="number" min="1" placeholder="Quantity" value={formData.quantity} onChange={(event) => setFormData({ ...formData, quantity: event.target.value })} />
                <select className="ops-input focus-outline" value={formData.priority} onChange={(event) => setFormData({ ...formData, priority: event.target.value })}>
                  <option value="high">Critical</option>
                  <option value="medium">Within 3 days</option>
                  <option value="low">Flexible</option>
                </select>
              </div>
              <input className="ops-input focus-outline" type="text" placeholder="Delivery location" value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} />
              {message && <div className="status-banner success">{message}</div>}
              <button type="submit" className="primary-btn focus-outline">Submit Request</button>
            </form>
          </article>
        </>
      );
    }

    if (activeModule === 'campaigns') {
      return (
        <>
          <FilterToolbar
            title="Browse matching drives"
            searchValue={campaignSearch}
            onSearchChange={setCampaignSearch}
            searchPlaceholder="Search drives by title, location, or description"
            filters={[
              {
                label: 'categories',
                value: campaignCategory,
                onChange: setCampaignCategory,
                options: buildFilterOptions(drives, 'category')
              },
              {
                label: 'priorities',
                value: campaignPriority,
                onChange: setCampaignPriority,
                options: buildFilterOptions(drives, 'priority')
              }
            ]}
          />
          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Current drives</h2>
                <p>Campaigns that may align with your request.</p>
              </div>
              <span className="pill">{filteredDrives.length} drives</span>
            </div>
            <div className="record-list">
              {filteredDrives.length === 0 ? (
                <div className="empty-state">No drives available yet.</div>
              ) : (
                filteredDrives.map((drive) => (
                  <div key={drive.id} className="record-row">
                    <div>
                      <strong>{drive.title}</strong>
                      <p>{drive.description || drive.location || 'Drive details pending'}</p>
                    </div>
                    <div className="record-meta">
                      <span>{drive.location || 'No location'}</span>
                      <span>{formatLabel(drive.category)}</span>
                      <span>{formatLabel(drive.priority)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </>
      );
    }

    if (activeModule === 'history') {
      return (
        <>
          <div className="metric-grid metric-grid--3">
            <article className="section-card metric-card accent-orange">
              <small>Open</small>
              <strong>{openRequests}</strong>
              <span>Requests still waiting for support</span>
            </article>
            <article className="section-card metric-card accent-red">
              <small>Critical</small>
              <strong>{criticalRequests}</strong>
              <span>Requests marked with high urgency</span>
            </article>
            <article className="section-card metric-card accent-blue">
              <small>Fulfilled</small>
              <strong>{fulfilledRequests}</strong>
              <span>Requests already completed successfully</span>
            </article>
          </div>
          <FilterToolbar
            title="Filter my requests"
            searchValue={historySearch}
            onSearchChange={setHistorySearch}
            searchPlaceholder="Search requests by title, details, or location"
            filters={[
              {
                label: 'priorities',
                value: historyPriority,
                onChange: setHistoryPriority,
                options: buildFilterOptions(myRequests, 'priority')
              },
              {
                label: 'statuses',
                value: historyStatus,
                onChange: setHistoryStatus,
                options: buildFilterOptions(myRequests, 'status')
              }
            ]}
          />
          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>My requests</h2>
                <p>Follow the state of each essential-item request.</p>
              </div>
            </div>
            <div className="record-list">
              {filteredRequests.length === 0 ? (
                <div className="empty-state">No requests submitted yet.</div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="record-row">
                    <div>
                      <strong>{request.title}</strong>
                      <p>{request.description || request.location || 'No additional details provided'}</p>
                    </div>
                    <div className="record-meta">
                      <span>{formatLabel(request.category)}</span>
                      <span>{request.quantity || 0} units</span>
                      <span>{formatLabel(request.priority)}</span>
                      <span>{formatLabel(request.status)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </>
      );
    }

    return (
      <>
        <div className="metric-grid metric-grid--3">
          <article className="section-card metric-card accent-red">
            <small>My requests</small>
            <strong>{myRequests.length}</strong>
            <span>All requests submitted from your account</span>
          </article>
          <article className="section-card metric-card accent-orange">
            <small>Open requests</small>
            <strong>{openRequests}</strong>
            <span>Requests still waiting for fulfillment</span>
          </article>
          <article className="section-card metric-card accent-blue">
            <small>Critical items</small>
            <strong>{criticalRequests}</strong>
            <span>High-priority requests needing urgent support</span>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="section-card queue-card">
            <div className="section-head">
              <div>
                <h2>Support pulse</h2>
                <p>Understand your request flow before moving deeper.</p>
              </div>
            </div>
            <div className="queue-list">
              <div className="queue-item"><strong>{openRequests}</strong><span>Requests still waiting for action</span></div>
              <div className="queue-item"><strong>{criticalRequests}</strong><span>Critical requests marked high priority</span></div>
              <div className="queue-item"><strong>{drives.length}</strong><span>Active drives that may help you</span></div>
              <div className="queue-item"><strong>{myRequests.length}</strong><span>Total requests tracked in your dashboard</span></div>
            </div>
          </article>

          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Next steps</h2>
                <p>Use the dashboard navigation to move between modules.</p>
              </div>
            </div>
            <div className="record-list">
              <div className="record-row">
                <div>
                  <strong>Request Help</strong>
                  <p>Submit a new request with urgency, quantity, and location.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>Drives</strong>
                  <p>See live campaigns that could align with your household needs.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>My Requests</strong>
                  <p>Track statuses and review your previous submissions.</p>
                </div>
              </div>
            </div>
          </article>
        </div>
        <FeedbackPanel user={user} role="recipient" moduleOptions={recipientModules} defaultModule="overview" />
      </>
    );
  };

  return (
    <>
      <DashboardShell
        eyebrow="Recipient Help Queue"
        title="Request essentials and move page to page inside your recipient dashboard."
        description="Use the internal dashboard navigation to switch between overview, request submission, active drives, and your request history."
        user={user}
        onLogout={onLogout}
        modules={recipientModules}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        dashboardClassName="recipient-dashboard"
      >
        {error && <div className="status-banner error">{error}</div>}
        {renderModule()}
      </DashboardShell>

      <style>{`
        .metric-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .recipient-form-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        @media (max-width: 900px) { .metric-grid--3, .recipient-form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

export default RecipientDashboard;
