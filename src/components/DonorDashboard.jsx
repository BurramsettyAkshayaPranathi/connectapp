import React, { useEffect, useState } from 'react';
import { createDonation, fetchDonationsByUser, fetchDrives } from '../utils/api';
import DashboardShell from './DashboardShell';
import FeedbackPanel from './FeedbackPanel';
import FilterToolbar from './FilterToolbar';
import ImagePreview from './ImagePreview';
import { buildFilterOptions, formatLabel, matchesSearch } from '../utils/dashboard';
import { readImageAsDataUrl } from '../utils/imageUpload';

const donorModules = [
  { id: 'overview', label: 'Overview', description: 'Impact summary and quick status' },
  { id: 'donate', label: 'List Donation', description: 'Create a new donation entry' },
  { id: 'campaigns', label: 'Campaigns', description: 'Browse active platform drives' },
  { id: 'history', label: 'My Records', description: 'Review submitted donations' }
];

function DonorDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('overview');
  const [formData, setFormData] = useState({
    title: '',
    category: 'food',
    quantity: '',
    location: '',
    imageData: ''
  });
  const [message, setMessage] = useState('');
  const [myDonations, setMyDonations] = useState([]);
  const [drives, setDrives] = useState([]);
  const [error, setError] = useState('');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignCategory, setCampaignCategory] = useState('all');
  const [campaignPriority, setCampaignPriority] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [historyCategory, setHistoryCategory] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchDonationsByUser(user.email), fetchDrives()])
      .then(([donations, driveData]) => {
        if (isMounted) {
          setMyDonations(donations);
          setDrives(driveData);
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || 'Failed to load donor data.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newDonation = await createDonation({
        ...formData,
        quantity: Number(formData.quantity) || 0,
        priority: 'medium',
        donorName: user.name,
        createdByEmail: user.email
      });

      setMyDonations((currentDonations) => [newDonation, ...currentDonations]);
      setMessage('Donation listed successfully.');
      setError('');
      setFormData({
        title: '',
        category: 'food',
        quantity: '',
        location: '',
        imageData: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (apiError) {
      setError(apiError.message || 'Failed to save donation.');
    }
  };

  const handleImageChange = async (event) => {
    try {
      const imageData = await readImageAsDataUrl(event.target.files?.[0]);
      setFormData((current) => ({ ...current, imageData }));
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Could not read image.');
      event.target.value = '';
    }
  };

  const totalItems = myDonations.reduce((sum, donation) => sum + (Number(donation.quantity) || 0), 0);
  const activeDriveCount = drives.filter((drive) => formatLabel(drive.priority) !== 'low').length;
  const donationStatusCounts = {
    open: myDonations.filter((donation) => formatLabel(donation.status) === 'open').length,
    pending: myDonations.filter((donation) => formatLabel(donation.status) === 'pending').length,
    delivered: myDonations.filter((donation) => formatLabel(donation.status) === 'delivered').length
  };
  const filteredDrives = drives.filter((drive) => (
    matchesSearch(drive, campaignSearch, ['title', 'description', 'location'])
    && (campaignCategory === 'all' || formatLabel(drive.category) === campaignCategory)
    && (campaignPriority === 'all' || formatLabel(drive.priority) === campaignPriority)
  ));
  const filteredDonations = myDonations.filter((donation) => (
    matchesSearch(donation, historySearch, ['title', 'location'])
    && (historyCategory === 'all' || formatLabel(donation.category) === historyCategory)
    && (historyStatus === 'all' || formatLabel(donation.status) === historyStatus)
  ));

  const renderModule = () => {
    if (activeModule === 'donate') {
      return (
        <>
          <article className="section-card workbench-card">
            <div className="section-head">
              <div>
                <h2>List a new donation</h2>
                <p>Add food, clothing, hygiene kits, shelter items, or other essentials.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="ops-form">
              <input className="ops-input focus-outline" type="text" placeholder="What are you donating?" required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
              <div className="ops-form__row donor-form-grid">
                <select className="ops-input focus-outline" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })}>
                  <option value="food">Food</option>
                  <option value="clothing">Clothing</option>
                  <option value="shelter">Shelter items</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
                <input className="ops-input focus-outline" type="number" min="1" placeholder="Quantity" value={formData.quantity} onChange={(event) => setFormData({ ...formData, quantity: event.target.value })} />
              </div>
              <input className="ops-input focus-outline" type="text" placeholder="Pickup location" value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} />
              <input className="ops-input focus-outline" type="file" accept="image/*" onChange={handleImageChange} />
              <ImagePreview src={formData.imageData} alt="Donation preview" />
              {message && <div className="status-banner success">{message}</div>}
              <button type="submit" className="primary-btn focus-outline">Save Donation</button>
            </form>
          </article>
        </>
      );
    }

    if (activeModule === 'campaigns') {
      return (
        <>
          <FilterToolbar
            title="Find matching drives"
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
                <h2>Campaign opportunities</h2>
                <p>Current drives where your inventory can help most.</p>
              </div>
              <span className="pill">{filteredDrives.length} drives</span>
            </div>
            <div className="record-list">
              {filteredDrives.length === 0 ? (
                <div className="empty-state">No active drives yet.</div>
              ) : (
                filteredDrives.map((drive) => (
                  <div key={drive.id} className="record-row">
                    <div>
                      <ImagePreview src={drive.imageData} alt={drive.title} />
                      <strong>{drive.title}</strong>
                      <p>{drive.description || drive.location || 'Campaign details pending'}</p>
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
            <article className="section-card metric-card accent-teal">
              <small>Open</small>
              <strong>{donationStatusCounts.open}</strong>
              <span>Donation records still awaiting the next action</span>
            </article>
            <article className="section-card metric-card accent-orange">
              <small>Pending</small>
              <strong>{donationStatusCounts.pending}</strong>
              <span>Donations currently being coordinated</span>
            </article>
            <article className="section-card metric-card accent-blue">
              <small>Delivered</small>
              <strong>{donationStatusCounts.delivered}</strong>
              <span>Donations already completed or distributed</span>
            </article>
          </div>
          <FilterToolbar
            title="Filter my records"
            searchValue={historySearch}
            onSearchChange={setHistorySearch}
            searchPlaceholder="Search donations by title or location"
            filters={[
              {
                label: 'categories',
                value: historyCategory,
                onChange: setHistoryCategory,
                options: buildFilterOptions(myDonations, 'category')
              },
              {
                label: 'statuses',
                value: historyStatus,
                onChange: setHistoryStatus,
                options: buildFilterOptions(myDonations, 'status')
              }
            ]}
          />
          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>My donation records</h2>
                <p>Track what you listed and the current donation status.</p>
              </div>
            </div>
            <div className="record-list">
              {filteredDonations.length === 0 ? (
                <div className="empty-state">No donations listed yet.</div>
              ) : (
                filteredDonations.map((donation) => (
                  <div key={donation.id} className="record-row">
                    <div>
                      <ImagePreview src={donation.imageData} alt={donation.title} />
                      <strong>{donation.title}</strong>
                      <p>{donation.location || 'Pickup location not provided'}</p>
                    </div>
                    <div className="record-meta">
                      <span>{formatLabel(donation.category)}</span>
                      <span>{donation.quantity || 0} units</span>
                      <span>{formatLabel(donation.status)}</span>
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
          <article className="section-card metric-card accent-teal">
            <small>My donations</small>
            <strong>{myDonations.length}</strong>
            <span>Total donation records submitted from your account</span>
          </article>
          <article className="section-card metric-card accent-orange">
            <small>Total items</small>
            <strong>{totalItems}</strong>
            <span>Units of relief material you have offered</span>
          </article>
          <article className="section-card metric-card accent-blue">
            <small>Active drives</small>
            <strong>{activeDriveCount}</strong>
            <span>Campaigns open for contribution across the platform</span>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="section-card queue-card">
            <div className="section-head">
              <div>
                <h2>Contribution pulse</h2>
                <p>Quick signals from your donor workspace.</p>
              </div>
            </div>
            <div className="queue-list">
              <div className="queue-item"><strong>{drives.length}</strong><span>Total drives currently visible to donors</span></div>
              <div className="queue-item"><strong>{myDonations.length}</strong><span>Donation records you can monitor</span></div>
              <div className="queue-item"><strong>{totalItems}</strong><span>Total listed units ready for pickup or routing</span></div>
              <div className="queue-item"><strong>{activeDriveCount}</strong><span>Drives currently marked urgent or active</span></div>
            </div>
          </article>

          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Next steps</h2>
                <p>Move through your dashboard using dedicated sub modules.</p>
              </div>
            </div>
            <div className="record-list">
              <div className="record-row">
                <div>
                  <strong>List Donation</strong>
                  <p>Create a new donation and share quantity, category, and pickup location.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>Campaigns</strong>
                  <p>Review current drives to see where support is needed most.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>My Records</strong>
                  <p>Track every donation you have already submitted.</p>
                </div>
              </div>
            </div>
          </article>
        </div>
        <FeedbackPanel user={user} role="donor" moduleOptions={donorModules} defaultModule="overview" />
      </>
    );
  };

  return (
    <>
      <DashboardShell
        eyebrow="Donor Supply Desk"
        title="List available essentials and move through your donor dashboard module by module."
        description="Your donations help households receive urgent support faster. Use the internal navigation to switch between overview, donation entry, campaigns, and your records."
        user={user}
        onLogout={onLogout}
        modules={donorModules}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        dashboardClassName="donor-dashboard"
      >
        {error && <div className="status-banner error">{error}</div>}
        {renderModule()}
      </DashboardShell>

      <style>{`
        .metric-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .donor-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width: 900px) { .metric-grid--3, .donor-form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

export default DonorDashboard;
