import React, { useEffect, useState } from 'react';
import {
  createDrive,
  fetchAdminSummary,
  fetchDonations,
  fetchDrives,
  fetchRequests,
  fetchShipments
} from '../utils/api';
import DashboardShell from './DashboardShell';
import FeedbackPanel from './FeedbackPanel';
import FilterToolbar from './FilterToolbar';
import ImagePreview from './ImagePreview';
import { buildFilterOptions, formatLabel, matchesSearch } from '../utils/dashboard';
import { readImageAsDataUrl } from '../utils/imageUpload';

const adminModules = [
  { id: 'overview', label: 'Overview', description: 'Platform summary and KPIs' },
  { id: 'drives', label: 'Create Drive', description: 'Launch new campaigns' },
  { id: 'requests', label: 'Requests', description: 'Monitor recipient demand' },
  { id: 'logistics', label: 'Logistics', description: 'Watch delivery movement' }
];

function AdminDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('overview');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    location: '',
    priority: 'high',
    imageData: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [driveSearch, setDriveSearch] = useState('');
  const [driveCategory, setDriveCategory] = useState('all');
  const [drivePriority, setDrivePriority] = useState('all');
  const [requestSearch, setRequestSearch] = useState('');
  const [requestPriority, setRequestPriority] = useState('all');
  const [requestStatus, setRequestStatus] = useState('all');
  const [shipmentSearch, setShipmentSearch] = useState('');
  const [shipmentStatus, setShipmentStatus] = useState('all');
  const [summary, setSummary] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    activeRequests: 0,
    completedDeliveries: 0
  });

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchAdminSummary(),
      fetchDrives(),
      fetchDonations(),
      fetchRequests(),
      fetchShipments()
    ])
      .then(([summaryData, drivesData, donationsData, requestsData, shipmentsData]) => {
        if (!isMounted) return;
        setSummary(summaryData);
        setDrives(drivesData);
        setDonations(donationsData);
        setRequests(requestsData);
        setShipments(shipmentsData);
        setError('');
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || 'Backend not reachable. Please verify your server connection.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newDrive = await createDrive({
        ...formData,
        createdByEmail: user.email
      });
      setDrives((current) => [newDrive, ...current]);
      setMessage('New donation drive created successfully.');
      setError('');
      setFormData({
        title: '',
        description: '',
        category: 'food',
        location: '',
        priority: 'high',
        imageData: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (apiError) {
      setError(apiError.message || 'Failed to create drive.');
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

  const openRequests = requests.filter((item) => formatLabel(item.status) === 'open');
  const highPriorityDrives = drives.filter((item) => formatLabel(item.priority) === 'high');
  const inTransitShipments = shipments.filter((item) => formatLabel(item.status) === 'in transit');
  const filteredDrives = drives.filter((drive) => (
    matchesSearch(drive, driveSearch, ['title', 'description', 'location'])
    && (driveCategory === 'all' || formatLabel(drive.category) === driveCategory)
    && (drivePriority === 'all' || formatLabel(drive.priority) === drivePriority)
  ));
  const filteredRequests = requests.filter((request) => (
    matchesSearch(request, requestSearch, ['title', 'description', 'location'])
    && (requestPriority === 'all' || formatLabel(request.priority) === requestPriority)
    && (requestStatus === 'all' || formatLabel(request.status) === requestStatus)
  ));
  const filteredShipments = shipments.filter((shipment) => (
    matchesSearch(shipment, shipmentSearch, ['title', 'location', 'logisticsContact'])
    && (shipmentStatus === 'all' || formatLabel(shipment.status) === shipmentStatus)
  ));

  const renderModule = () => {
    if (activeModule === 'drives') {
      return (
        <>
          <article className="section-card workbench-card">
            <div className="section-head">
              <div>
                <h2>Create donation drive</h2>
                <p>Launch a new food, clothing, shelter, or medical campaign.</p>
              </div>
              <span className="pill">Admin action</span>
            </div>

            <form className="ops-form" onSubmit={handleSubmit}>
              <div className="ops-form__row ops-form__row--2">
                <input className="ops-input focus-outline" type="text" placeholder="Drive title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <input className="ops-input focus-outline" type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <textarea className="ops-input ops-textarea focus-outline" rows="4" placeholder="Describe the emergency need or campaign goal" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="ops-form__row ops-form__row--2">
                <select className="ops-input focus-outline" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="food">Food</option>
                  <option value="clothing">Clothing</option>
                  <option value="shelter">Shelter</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
                <select className="ops-input focus-outline" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <input className="ops-input focus-outline" type="file" accept="image/*" onChange={handleImageChange} />
              <ImagePreview src={formData.imageData} alt="Drive preview" />
              {message && <div className="status-banner success">{message}</div>}
              <button type="submit" className="primary-btn focus-outline">Create Drive</button>
            </form>
          </article>

          <FilterToolbar
            title="Filter recent drives"
            searchValue={driveSearch}
            onSearchChange={setDriveSearch}
            searchPlaceholder="Search drives by title, location, or description"
            filters={[
              {
                label: 'categories',
                value: driveCategory,
                onChange: setDriveCategory,
                options: buildFilterOptions(drives, 'category')
              },
              {
                label: 'priorities',
                value: drivePriority,
                onChange: setDrivePriority,
                options: buildFilterOptions(drives, 'priority')
              }
            ]}
          />

          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Recent drives</h2>
                <p>Newest campaigns launched by the admin team.</p>
              </div>
            </div>
            <div className="record-list">
              {filteredDrives.length === 0 ? (
                <div className="empty-state">No drives created yet.</div>
              ) : (
                filteredDrives.slice(0, 8).map((drive) => (
                  <div key={drive.id} className="record-row">
                    <div>
                      <ImagePreview src={drive.imageData} alt={drive.title} />
                      <strong>{drive.title}</strong>
                      <p>{drive.description || 'No description provided.'}</p>
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

    if (activeModule === 'requests') {
      return (
        <>
          <div className="metric-grid metric-grid--3">
            <article className="section-card metric-card accent-red">
              <small>Open</small>
              <strong>{openRequests.length}</strong>
              <span>Requests currently waiting for action</span>
            </article>
            <article className="section-card metric-card accent-orange">
              <small>High priority</small>
              <strong>{requests.filter((request) => formatLabel(request.priority) === 'high').length}</strong>
              <span>Requests marked urgent by recipients</span>
            </article>
            <article className="section-card metric-card accent-blue">
              <small>Total requests</small>
              <strong>{requests.length}</strong>
              <span>All visible recipient requests across the platform</span>
            </article>
          </div>
          <FilterToolbar
            title="Filter recipient demand"
            searchValue={requestSearch}
            onSearchChange={setRequestSearch}
            searchPlaceholder="Search requests by title, details, or location"
            filters={[
              {
                label: 'priorities',
                value: requestPriority,
                onChange: setRequestPriority,
                options: buildFilterOptions(requests, 'priority')
              },
              {
                label: 'statuses',
                value: requestStatus,
                onChange: setRequestStatus,
                options: buildFilterOptions(requests, 'status')
              }
            ]}
          />
          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Latest recipient requests</h2>
                <p>Urgent demand signals from the field.</p>
              </div>
              <span className="pill">{filteredRequests.filter((request) => formatLabel(request.status) === 'open').length} open</span>
            </div>
            <div className="record-list">
              {filteredRequests.length === 0 ? (
                <div className="empty-state">No recipient requests found.</div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="record-row">
                    <div>
                      <ImagePreview src={request.imageData} alt={request.title} />
                      <strong>{request.title}</strong>
                      <p>{request.description || request.location || 'Location pending'}</p>
                    </div>
                    <div className="record-meta">
                      <span>{request.quantity || 0} items</span>
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

    if (activeModule === 'logistics') {
      return (
        <>
          <div className="metric-grid metric-grid--3">
            <article className="section-card metric-card accent-orange">
              <small>In transit</small>
              <strong>{inTransitShipments.length}</strong>
              <span>Shipments currently being monitored live</span>
            </article>
            <article className="section-card metric-card accent-blue">
              <small>Delivered</small>
              <strong>{shipments.filter((shipment) => formatLabel(shipment.status) === 'delivered').length}</strong>
              <span>Shipments completed across all coordinators</span>
            </article>
            <article className="section-card metric-card accent-teal">
              <small>Total shipments</small>
              <strong>{shipments.length}</strong>
              <span>All logistics records currently available</span>
            </article>
          </div>
          <FilterToolbar
            title="Filter shipment watch"
            searchValue={shipmentSearch}
            onSearchChange={setShipmentSearch}
            searchPlaceholder="Search shipments by title, location, or coordinator"
            filters={[
              {
                label: 'statuses',
                value: shipmentStatus,
                onChange: setShipmentStatus,
                options: buildFilterOptions(shipments, 'status')
              }
            ]}
          />
          <div className="dashboard-grid dashboard-grid--bottom">
            <article className="section-card queue-card">
              <div className="section-head">
                <div>
                  <h2>Operations queue</h2>
                  <p>High-level bottlenecks that need oversight.</p>
                </div>
              </div>

              <div className="queue-list">
                <div className="queue-item"><strong>{highPriorityDrives.length}</strong><span>High-priority drives currently active</span></div>
                <div className="queue-item"><strong>{openRequests.length}</strong><span>Recipient requests still open</span></div>
                <div className="queue-item"><strong>{inTransitShipments.length}</strong><span>Shipments in transit across coordinators</span></div>
                <div className="queue-item"><strong>{donations.length}</strong><span>Total listed donations in the system</span></div>
              </div>
            </article>

            <article className="section-card list-card">
              <div className="section-head">
                <div>
                  <h2>Shipment watch</h2>
                  <p>Track the latest delivery movement across the platform.</p>
                </div>
              </div>
              <div className="record-list">
                {filteredShipments.length === 0 ? (
                  <div className="empty-state">No shipment updates found.</div>
                ) : (
                  filteredShipments.slice(0, 8).map((shipment) => (
                    <div key={shipment.id} className="record-row">
                      <div>
                        <strong>{shipment.title}</strong>
                        <p>{shipment.logisticsContact || shipment.location || 'Shipment details pending'}</p>
                      </div>
                      <div className="record-meta">
                        <span>{shipment.location || 'No location'}</span>
                        <span>{formatLabel(shipment.status)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="metric-grid">
          <article className="section-card metric-card accent-teal">
            <small>Total drives</small>
            <strong>{loading ? '...' : drives.length}</strong>
            <span>Active donation campaigns across categories</span>
          </article>
          <article className="section-card metric-card accent-orange">
            <small>Total donors</small>
            <strong>{loading ? '...' : summary.totalDonors}</strong>
            <span>People currently participating on the platform</span>
          </article>
          <article className="section-card metric-card accent-red">
            <small>Open requests</small>
            <strong>{loading ? '...' : summary.activeRequests}</strong>
            <span>Pending needs requiring action or matching</span>
          </article>
          <article className="section-card metric-card accent-blue">
            <small>Completed deliveries</small>
            <strong>{loading ? '...' : summary.completedDeliveries}</strong>
            <span>Shipments marked as fulfilled</span>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="section-card queue-card">
            <div className="section-head">
              <div>
                <h2>Operations queue</h2>
                <p>High-level bottlenecks that need oversight.</p>
              </div>
            </div>

            <div className="queue-list">
              <div className="queue-item"><strong>{highPriorityDrives.length}</strong><span>High-priority drives currently active</span></div>
              <div className="queue-item"><strong>{openRequests.length}</strong><span>Recipient requests still open</span></div>
              <div className="queue-item"><strong>{inTransitShipments.length}</strong><span>Shipments in transit across coordinators</span></div>
              <div className="queue-item"><strong>{donations.length}</strong><span>Total listed donations in the system</span></div>
            </div>
          </article>

          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Module highlights</h2>
                <p>Move page to page within the admin command center.</p>
              </div>
            </div>
            <div className="record-list">
              <div className="record-row">
                <div>
                  <strong>Create Drive</strong>
                  <p>Launch and review campaign activity in one admin module.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>Requests</strong>
                  <p>See current demand signals coming from recipients.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>Logistics</strong>
                  <p>Monitor shipments and last-mile execution progress.</p>
                </div>
              </div>
            </div>
          </article>
        </div>
        <FeedbackPanel user={user} role="admin" moduleOptions={adminModules} defaultModule="overview" />
      </>
    );
  };

  return (
    <>
      <DashboardShell
        eyebrow="Admin Command Center"
        title="Monitor drives, requests, donations, and delivery across multiple admin modules."
        description={`Welcome back, ${user.name}. Use the internal dashboard navigation to switch between overview, drive creation, recipient requests, and logistics monitoring.`}
        user={user}
        onLogout={onLogout}
        modules={adminModules}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        dashboardClassName="admin-dashboard"
      >
        {error && <div className="status-banner error">{error}</div>}
        {renderModule()}
      </DashboardShell>

      <style>{`
        .admin-dashboard { padding: 24px 0 54px; }
        .metric-grid, .dashboard-grid { display: grid; gap: 18px; margin-top: 18px; }
        .metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .dashboard-grid { grid-template-columns: 1.2fr 0.8fr; }
        .dashboard-grid--bottom { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .metric-card, .workbench-card, .queue-card, .list-card { padding: 24px; }
        .metric-card small { color: var(--text-faint); }
        .metric-card strong { display: block; font-size: 2rem; margin: 12px 0 10px; font-family: 'Space Grotesk', sans-serif; }
        .metric-card span { color: var(--text-soft); line-height: 1.6; }
        .accent-teal { border-top: 4px solid var(--primary); }
        .accent-orange { border-top: 4px solid var(--secondary); }
        .accent-red { border-top: 4px solid var(--danger); }
        .accent-blue { border-top: 4px solid var(--info); }
        .section-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
        .section-head h2 { font-family: 'Space Grotesk', sans-serif; margin-bottom: 6px; }
        .section-head p { color: var(--text-soft); }
        .ops-form, .queue-list, .record-list { display: grid; gap: 14px; }
        .ops-form__row { display: grid; gap: 12px; }
        .ops-form__row--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .ops-input { width: 100%; border: 1px solid var(--line-strong); background: rgba(255, 255, 255, 0.84); border-radius: 16px; padding: 14px 16px; }
        .ops-textarea { resize: vertical; min-height: 110px; }
        .queue-item, .record-row { padding: 16px; border-radius: var(--radius-md); background: rgba(247, 242, 232, 0.82); border: 1px solid var(--line); }
        .queue-item strong { display: block; font-size: 1.6rem; color: var(--primary-strong); margin-bottom: 6px; }
        .queue-item span, .record-row p { color: var(--text-soft); }
        .record-row { display: flex; justify-content: space-between; gap: 16px; }
        .record-row strong { display: block; margin-bottom: 6px; }
        .record-meta { display: flex; flex-direction: column; gap: 8px; min-width: 160px; color: var(--text-faint); text-transform: capitalize; }
        @media (max-width: 1100px) { .metric-grid, .dashboard-grid, .dashboard-grid--bottom { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 760px) { .dashboard-hero, .record-row { flex-direction: column; } .metric-grid, .dashboard-grid, .dashboard-grid--bottom, .ops-form__row--2 { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

export default AdminDashboard;
