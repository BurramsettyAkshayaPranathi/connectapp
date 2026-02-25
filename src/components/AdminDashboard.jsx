import React, { useState } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

function AdminDashboard({ user, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    location: '',
    priority: 'high'
  });

  const [message, setMessage] = useState('');

  const drives = getFromStorage(STORAGE_KEYS.DRIVES);
  const donations = getFromStorage(STORAGE_KEYS.DONATIONS);
  const requests = getFromStorage(STORAGE_KEYS.REQUESTS);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDrive = {
      ...formData,
      id: Date.now(),
      status: 'active',
      created_by: user.email,
      created_at: new Date().toISOString()
    };

    const allDrives = getFromStorage(STORAGE_KEYS.DRIVES);
    allDrives.push(newDrive);
    saveToStorage(STORAGE_KEYS.DRIVES, allDrives);

    setMessage("Drive created successfully!");
    setFormData({
      title: '',
      description: '',
      category: 'food',
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
            <h1>Admin Dashboard</h1>
            <p>Manage donation drives and platform operations</p>
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
          <div className="card orange">
            <p>Active Drives</p>
            <h2>{drives.length}</h2>
          </div>

          <div className="card green">
            <p>Total Donations</p>
            <h2>{donations.length}</h2>
          </div>

          <div className="card red">
            <p>Open Requests</p>
            <h2>{requests.length}</h2>
          </div>
        </div>

        {/* CREATE DRIVE */}
        <div className="card">
          <h2>Create New Donation Drive</h2>

          <form onSubmit={handleSubmit} className="form">
            <div className="row">
              <input
                type="text"
                placeholder="Drive Title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <textarea
              rows="3"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
                <option value="shelter">Shelter</option>
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </select>

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {message && <div className="success">{message}</div>}

            <button type="submit" className="submit-btn">
              Create Drive
            </button>
          </form>
        </div>

        {/* RECENT DRIVES */}
        <div className="card">
          <h2>Recent Drives</h2>

          {drives.length === 0 ? (
            <p>No drives created yet.</p>
          ) : (
            drives.slice(0, 5).map((drive) => (
              <div key={drive.id} className="drive-item">
                <h3>{drive.title}</h3>
                <p>{drive.description}</p>
                <div className="meta">
                  <span>📍 {drive.location || "N/A"}</span>
                  <span>📦 {drive.category}</span>
                  <span>{drive.priority}</span>
                </div>
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
          background: linear-gradient(to bottom right, #fff7ed, #fefce8);
        }

        .header {
          background: white;
          padding: 20px;
          border-bottom: 4px solid #f59e0b;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logout-btn {
          margin-top: 8px;
          padding: 8px 14px;
          background: #fee2e2;
          color: #dc2626;
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

        .orange { border-left: 5px solid #f59e0b; }
        .green { border-left: 5px solid #10b981; }
        .red { border-left: 5px solid #ef4444; }

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

        input, textarea, select {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .submit-btn {
          padding: 10px;
          background: #f59e0b;
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

        .drive-item {
          background: #fff7ed;
          padding: 10px;
          border-left: 4px solid #f59e0b;
          border-radius: 6px;
          margin-top: 10px;
        }

        .meta {
          display: flex;
          gap: 10px;
          font-size: 13px;
          margin-top: 5px;
        }
      `}</style>

    </div>
  );
}

export default AdminDashboard;