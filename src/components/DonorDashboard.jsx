import React, { useState } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

function DonorDashboard({ user, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'food',
    quantity: '',
    location: '',
    priority: 'high'
  });

  const [message, setMessage] = useState('');

  const myDonations = getFromStorage(STORAGE_KEYS.DONATIONS)
    .filter(d => d.created_by === user.email);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDonation = {
      ...formData,
      id: Date.now(),
      quantity: Number(formData.quantity) || 0,
      status: 'available',
      donor_name: user.name,
      created_by: user.email,
      created_at: new Date().toISOString()
    };

    const allDonations = getFromStorage(STORAGE_KEYS.DONATIONS);
    allDonations.push(newDonation);
    saveToStorage(STORAGE_KEYS.DONATIONS, allDonations);

    setMessage("Donation listed successfully!");
    setFormData({
      title: '',
      category: 'food',
      quantity: '',
      location: '',
      priority: 'high'
    });

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container">

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Donor Dashboard</h1>
            <p>List and track your donations</p>
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
          <div className="card green">
            <p>My Donations</p>
            <h2>{myDonations.length}</h2>
          </div>

          <div className="card green">
            <p>Total Items Donated</p>
            <h2>
              {myDonations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0)}
            </h2>
          </div>
        </div>

        {/* FORM */}
        <div className="card">
          <h2>List New Donation</h2>

          <form onSubmit={handleSubmit} className="form">

            <input
              type="text"
              placeholder="What are you donating?"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <div className="row">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="food">Food</option>
                <option value="clothing">Clothing</option>
                <option value="shelter">Shelter Items</option>
                <option value="hygiene">Hygiene Kits</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="high">High Need</option>
                <option value="medium">Medium Need</option>
                <option value="low">Low Need</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Pickup Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            {message && <div className="success">{message}</div>}

            <button type="submit" className="submit-btn">
              List Donation
            </button>
          </form>
        </div>

        {/* MY DONATIONS */}
        <div className="card">
          <h2>My Donations</h2>

          {myDonations.length === 0 ? (
            <p className="empty">No donations listed yet.</p>
          ) : (
            myDonations.map((donation) => (
              <div key={donation.id} className="donation-item">
                <h3>{donation.title}</h3>
                <div className="meta">
                  <span>📦 {donation.category}</span>
                  <span>🔢 {donation.quantity}</span>
                  <span>📍 {donation.location || "N/A"}</span>
                  <span>{donation.priority}</span>
                </div>
                <span className="badge">{donation.status}</span>
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
          background: linear-gradient(to bottom right, #f0fdf4, #ecfdf5);
        }

        .header {
          background: white;
          padding: 20px;
          border-bottom: 4px solid #10b981;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logout-btn {
          margin-top: 8px;
          padding: 8px 14px;
          background: #d1fae5;
          color: #065f46;
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

        .green {
          border-left: 5px solid #10b981;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }

        input, select {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .submit-btn {
          padding: 10px;
          background: #10b981;
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

        .donation-item {
          background: #f0fdf4;
          padding: 10px;
          border-left: 4px solid #10b981;
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
          background: #d1fae5;
          color: #065f46;
          font-size: 12px;
        }

        .empty {
          text-align: center;
          color: #555;
        }
      `}</style>

    </div>
  );
}

export default DonorDashboard;