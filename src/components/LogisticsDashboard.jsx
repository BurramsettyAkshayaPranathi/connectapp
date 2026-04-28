import React, { useEffect, useState } from 'react';
import { createShipment, fetchDonations, fetchRequests, fetchShipments } from '../utils/api';
import DashboardShell from './DashboardShell';
import FeedbackPanel from './FeedbackPanel';
import FilterToolbar from './FilterToolbar';
import { buildFilterOptions, formatLabel, matchesSearch } from '../utils/dashboard';

const logisticsModules = [
  { id: 'overview', label: 'Overview', description: 'Dispatch summary and live counts' },
  { id: 'shipments', label: 'Update Shipment', description: 'Create or update shipment progress' },
  { id: 'queue', label: 'Dispatch Queue', description: 'Prioritize logistics workload' },
  { id: 'ledger', label: 'Shipment Ledger', description: 'Review all shipment records' }
];

function LogisticsDashboard({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('overview');
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    status: 'in_transit',
    logistics_contact: '',
    linkedDonationId: '',
    linkedRequestId: ''
  });
  const [message, setMessage] = useState('');
  const [shipments, setShipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState('');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState('all');

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchShipments(), fetchRequests(), fetchDonations()])
      .then(([allShipments, allRequests, allDonations]) => {
        if (isMounted) {
          setShipments(allShipments);
          setRequests(allRequests);
          setDonations(allDonations);
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || 'Failed to load logistics data.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedDonation = donations.find((donation) => String(donation.id) === formData.linkedDonationId);
    const selectedRequest = requests.find((request) => String(request.id) === formData.linkedRequestId);

    try {
      const newShipment = await createShipment({
        title: formData.title,
        location: formData.location,
        status: formData.status,
        logisticsContact: formData.logistics_contact,
        createdByEmail: user.email,
        donorEmail: selectedDonation?.createdByEmail || '',
        recipientEmail: selectedRequest?.createdByEmail || '',
        relatedDonationTitle: selectedDonation?.title || '',
        relatedRequestTitle: selectedRequest?.title || ''
      });

      setShipments((currentShipments) => [newShipment, ...currentShipments]);
      setMessage('Shipment updated successfully.');
      setError('');
      setFormData({
        title: '',
        location: '',
        status: 'in_transit',
        logistics_contact: '',
        linkedDonationId: '',
        linkedRequestId: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (apiError) {
      setError(apiError.message || 'Failed to save shipment.');
    }
  };

  const inTransit = shipments.filter((shipment) => formatLabel(shipment.status) === 'in transit').length;
  const delivered = shipments.filter((shipment) => formatLabel(shipment.status) === 'delivered').length;
  const openRequests = requests.filter((request) => formatLabel(request.status) === 'open').length;
  const pendingPickup = shipments.filter((shipment) => formatLabel(shipment.status) === 'pending pickup').length;
  const filteredShipments = shipments.filter((shipment) => (
    matchesSearch(shipment, ledgerSearch, ['title', 'location', 'logisticsContact'])
    && (ledgerStatus === 'all' || formatLabel(shipment.status) === ledgerStatus)
  ));

  const renderModule = () => {
    if (activeModule === 'shipments') {
      return (
        <>
          <article className="section-card workbench-card">
            <div className="section-head">
              <div>
                <h2>Update shipment status</h2>
                <p>Track dispatch progress and maintain coordinator accountability.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="ops-form">
              <input className="ops-input focus-outline" type="text" placeholder="Shipment reference" required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
              <div className="ops-form__row logistics-form-grid">
                <input className="ops-input focus-outline" type="text" placeholder="Coordinator contact" value={formData.logistics_contact} onChange={(event) => setFormData({ ...formData, logistics_contact: event.target.value })} />
                <select className="ops-input focus-outline" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                  <option value="in_transit">In transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="pending_pickup">Pending pickup</option>
                </select>
              </div>
              <div className="ops-form__row logistics-form-grid">
                <select className="ops-input focus-outline" value={formData.linkedDonationId} onChange={(event) => setFormData({ ...formData, linkedDonationId: event.target.value })}>
                  <option value="">Optional matched donation</option>
                  {donations.map((donation) => (
                    <option key={donation.id} value={donation.id}>
                      {donation.title} ({donation.createdByEmail})
                    </option>
                  ))}
                </select>
                <select className="ops-input focus-outline" value={formData.linkedRequestId} onChange={(event) => setFormData({ ...formData, linkedRequestId: event.target.value })}>
                  <option value="">Optional matched request</option>
                  {requests.map((request) => (
                    <option key={request.id} value={request.id}>
                      {request.title} ({request.createdByEmail})
                    </option>
                  ))}
                </select>
              </div>
              <input className="ops-input focus-outline" type="text" placeholder="Current or destination location" value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} />
              {(formData.linkedDonationId || formData.linkedRequestId) && (
                <div className="status-banner success">
                  Matching emails will be sent to the linked donor and recipient when this shipment is saved.
                </div>
              )}
              {message && <div className="status-banner success">{message}</div>}
              <button type="submit" className="primary-btn focus-outline">Save Shipment</button>
            </form>
          </article>
        </>
      );
    }

    if (activeModule === 'queue') {
      return (
        <>
          <article className="section-card queue-card">
            <div className="section-head">
              <div>
                <h2>Dispatch queue</h2>
                <p>Quick operational signals for field movement.</p>
              </div>
            </div>
            <div className="queue-list">
              <div className="queue-item"><strong>{donations.length}</strong><span>Donations available for routing</span></div>
              <div className="queue-item"><strong>{requests.length}</strong><span>Total recipient requests in the system</span></div>
              <div className="queue-item"><strong>{openRequests}</strong><span>Open requests to prioritize</span></div>
              <div className="queue-item"><strong>{inTransit}</strong><span>Live shipments to watch</span></div>
            </div>
          </article>
        </>
      );
    }

    if (activeModule === 'ledger') {
      return (
        <>
          <div className="metric-grid metric-grid--3">
            <article className="section-card metric-card accent-orange">
              <small>Pending pickup</small>
              <strong>{pendingPickup}</strong>
              <span>Shipment entries still waiting to move</span>
            </article>
            <article className="section-card metric-card accent-blue">
              <small>In transit</small>
              <strong>{inTransit}</strong>
              <span>Shipments actively moving through the network</span>
            </article>
            <article className="section-card metric-card accent-teal">
              <small>Delivered</small>
              <strong>{delivered}</strong>
              <span>Shipments successfully completed</span>
            </article>
          </div>
          <FilterToolbar
            title="Filter shipment ledger"
            searchValue={ledgerSearch}
            onSearchChange={setLedgerSearch}
            searchPlaceholder="Search by shipment, location, or coordinator"
            filters={[
              {
                label: 'statuses',
                value: ledgerStatus,
                onChange: setLedgerStatus,
                options: buildFilterOptions(shipments, 'status')
              }
            ]}
          />
          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Shipment ledger</h2>
                <p>All recorded shipment updates from logistics coordinators.</p>
              </div>
            </div>
            <div className="record-list">
              {filteredShipments.length === 0 ? (
                <div className="empty-state">No shipments tracked yet.</div>
              ) : (
                filteredShipments.map((shipment) => (
                  <div key={shipment.id} className="record-row">
                    <div>
                      <strong>{shipment.title}</strong>
                      <p>{shipment.logisticsContact || shipment.location || 'Coordinator details pending'}</p>
                      {(shipment.relatedDonationTitle || shipment.relatedRequestTitle) && (
                        <p>
                          {shipment.relatedDonationTitle ? `Donation: ${shipment.relatedDonationTitle}` : 'Donation: N/A'}
                          {' | '}
                          {shipment.relatedRequestTitle ? `Request: ${shipment.relatedRequestTitle}` : 'Request: N/A'}
                        </p>
                      )}
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
        </>
      );
    }

    return (
      <>
        <div className="metric-grid metric-grid--4">
          <article className="section-card metric-card accent-blue">
            <small>Total shipments</small>
            <strong>{shipments.length}</strong>
            <span>All tracked movements across the platform</span>
          </article>
          <article className="section-card metric-card accent-orange">
            <small>In transit</small>
            <strong>{inTransit}</strong>
            <span>Shipments currently on the move</span>
          </article>
          <article className="section-card metric-card accent-teal">
            <small>Delivered</small>
            <strong>{delivered}</strong>
            <span>Completed delivery confirmations</span>
          </article>
          <article className="section-card metric-card accent-red">
            <small>Open requests</small>
            <strong>{openRequests}</strong>
            <span>Pending needs that still require routing</span>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="section-card list-card">
            <div className="section-head">
              <div>
                <h2>Movement summary</h2>
                <p>See where dispatch attention is needed right now.</p>
              </div>
            </div>
            <div className="record-list">
              <div className="record-row">
                <div>
                  <strong>Update Shipment</strong>
                  <p>Create a new shipment event or update a delivery status.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>Dispatch Queue</strong>
                  <p>Use priority counts to decide what moves next.</p>
                </div>
              </div>
              <div className="record-row">
                <div>
                  <strong>Shipment Ledger</strong>
                  <p>Review all shipment records in one place.</p>
                </div>
              </div>
            </div>
          </article>

          <article className="section-card queue-card">
            <div className="section-head">
              <div>
                <h2>Workload pulse</h2>
                <p>Fast operational indicators for the logistics team.</p>
              </div>
            </div>
            <div className="queue-list">
              <div className="queue-item"><strong>{donations.length}</strong><span>Donation records available to route</span></div>
              <div className="queue-item"><strong>{requests.length}</strong><span>Recipient requests in planning scope</span></div>
              <div className="queue-item"><strong>{shipments.length}</strong><span>Shipment records currently tracked</span></div>
              <div className="queue-item"><strong>{delivered}</strong><span>Successfully completed deliveries</span></div>
            </div>
          </article>
        </div>
        <FeedbackPanel user={user} role="logistics" moduleOptions={logisticsModules} defaultModule="overview" />
      </>
    );
  };

  return (
    <>
      <DashboardShell
        eyebrow="Logistics Control"
        title="Coordinate pickups and manage logistics from one dashboard."
        description="Use the internal modules to switch between live overview, shipment updates, dispatch queue, and the shipment ledger."
        user={user}
        onLogout={onLogout}
        modules={logisticsModules}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        dashboardClassName="logistics-dashboard"
      >
        {error && <div className="status-banner error">{error}</div>}
        {renderModule()}
      </DashboardShell>

      <style>{`
        .metric-grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .logistics-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width: 900px) { .metric-grid--4, .logistics-form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

export default LogisticsDashboard;
