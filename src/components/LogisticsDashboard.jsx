import React, { useState } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

function LogisticsDashboard({ user, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    status: 'in_transit',
    logistics_contact: ''
  });

  const [message, setMessage] = useState('');

  const shipments = getFromStorage(STORAGE_KEYS.SHIPMENTS);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newShipment = {
      ...formData,
      id: Date.now(),
      created_by: user.email,
      created_at: new Date().toISOString()
    };

    const allShipments = getFromStorage(STORAGE_KEYS.SHIPMENTS);
    allShipments.push(newShipment);
    saveToStorage(STORAGE_KEYS.SHIPMENTS, allShipments);

    setMessage("Shipment updated successfully!");
    setFormData({
      title: '',
      location: '',
      status: 'in_transit',
      logistics_contact: ''
    });

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container">

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Logistics Dashboard</h1>
            <p>Coordinate deliveries and manage inventory</p>
          </div>

          <div className="header-right">
            <p><strong>{user.name}</strong></p>
            <p>{user.email}</p>
            <button className="logout-btn" onClick={onLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main">

        {/* STATS */}
        <div className="stats">
          <div className="card blue">
            <p>Total Shipments</p>
            <h2>{shipments.length}</h2>
          </div>

          <div className="card blue">
            <p>In Transit</p>
            <h2>{shipments.filter(s => s.status === 'in_transit').length}</h2>
          </div>

          <div className="card blue">
            <p>Delivered</p>
            <h2>{shipments.filter(s => s.status === 'delivered').length}</h2>
          </div>
        </div>

        {/* FORM */}
        <div className="card">
          <h2>Update Shipment Status</h2>

          <form onSubmit={handleSubmit} className="form">

            <input
              type="text"
              placeholder="Shipment Reference"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <div className="row">
              <input
                type="text"
                placeholder="Coordinator Contact"
                value={formData.logistics_contact}
                onChange={(e) =>
                  setFormData({ ...formData, logistics_contact: e.target.value })
                }
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="pending_pickup">Pending Pickup</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Current / Destination Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            {message && <div className="success">{message}</div>}

            <button type="submit" className="submit-btn">
              Update Shipment
            </button>

          </form>
        </div>

        {/* ALL SHIPMENTS */}
        <div className="card">
          <h2>All Shipments</h2>

          {shipments.length === 0 ? (
            <p className="empty">No shipments tracked yet.</p>
          ) : (
            shipments.map((shipment) => (
              <div key={shipment.id} className="shipment-item">
                <h3>{shipment.title}</h3>
                <div className="meta">
                  <span>📍 {shipment.location || "N/A"}</span>
                  {shipment.logistics_contact && (
                    <span>👤 {shipment.logistics_contact}</span>
                  )}
                </div>
                <span className={`badge ${shipment.status}`}>
                  {shipment.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>

      </main>

      {/* INTERNAL CSS */}
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #eff6ff, #ecfeff);
        }

        .header {
          background: white;
          padding: 20px;
          border-bottom: 4px solid #3b82f6;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logout-btn {
          margin-top: 8px;
          padding: 8px 14px;
          background: #dbeafe;
          color: #1e40af;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .main {
          padding: 20px;
          max-width: 1100px;
          margin: auto;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }

        .blue {
          border-left: 5px solid #3b82f6;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        input, select {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .submit-btn {
          padding: 10px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .success {
          background: #d1fae5;
          color: #065f46;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
        }

        .shipment-item {
          background: #eff6ff;
          padding: 10px;
          border-left: 4px solid #3b82f6;
          border-radius: 6px;
          margin-top: 10px;
        }

        .meta {
          display: flex;
          gap: 10px;
          font-size: 13px;
          margin-top: 5px;
        }

        .badge {
          display: inline-block;
          margin-top: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge.delivered {
          background: #d1fae5;
          color: #065f46;
        }

        .badge.in_transit,
        .badge.pending_pickup {
          background: #dbeafe;
          color: #1e40af;
        }

        .empty {
          text-align: center;
          color: #555;
        }
      `}</style>

    </div>
  );
}

export default LogisticsDashboard;