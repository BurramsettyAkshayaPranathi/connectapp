import React, { useState } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

function RecipientDashboard({ user, onLogout }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    quantity: '',
    location: '',
    priority: 'high'
  });

  const [message, setMessage] = useState('');

  const myRequests = getFromStorage(STORAGE_KEYS.REQUESTS)
    .filter(r => r.created_by === user.email);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      ...formData,
      id: Date.now(),
      quantity: Number(formData.quantity) || 0,
      status: 'open',
      recipient_name: user.name,
      created_by: user.email,
      created_at: new Date().toISOString()
    };

    const allRequests = getFromStorage(STORAGE_KEYS.REQUESTS);
    allRequests.push(newRequest);
    saveToStorage(STORAGE_KEYS.REQUESTS, allRequests);

    setMessage("Request submitted successfully!");
    setFormData({
      title: '',
      description: '',
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
            <h1>Recipient Dashboard</h1>
            <p>Request essentials and track deliveries</p>
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
          <div className="card red">
            <p>My Requests</p>
            <h2>{myRequests.length}</h2>
          </div>

          <div className="card red">
            <p>Open Requests</p>
            <h2>
              {myRequests.filter(r => r.status === 'open').length}
            </h2>
          </div>
        </div>

        {/* FORM */}
        <div className="card">
          <h2>Submit New Request</h2>

          <form onSubmit={handleSubmit} className="form">

            <input
              type="text"
              placeholder="What do you need most?"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <textarea
              rows="3"
              placeholder="Additional Details"
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
                <option value="high">Critical</option>
                <option value="medium">Within 3 days</option>
                <option value="low">Flexible</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Delivery Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            {message && <div className="success">{message}</div>}

            <button type="submit" className="submit-btn">
              Submit Request
            </button>

          </form>
        </div>

        {/* MY REQUESTS */}
        <div className="card">
          <h2>My Requests</h2>

          {myRequests.length === 0 ? (
            <p className="empty">No requests submitted yet.</p>
          ) : (
            myRequests.map((request) => (
              <div key={request.id} className="request-item">
                <h3>{request.title}</h3>
                {request.description && <p>{request.description}</p>}
                <div className="meta">
                  <span>📦 {request.category}</span>
                  <span>🔢 {request.quantity}</span>
                  <span>📍 {request.location || "N/A"}</span>
                  <span>{request.priority}</span>
                </div>
                <span className="badge">{request.status}</span>
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
          background: linear-gradient(to bottom right, #fef2f2, #fdf2f8);
        }

        .header {
          background: white;
          padding: 20px;
          border-bottom: 4px solid #ef4444;
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
          color: #991b1b;
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

        .red {
          border-left: 5px solid #ef4444;
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

        input, textarea, select {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .submit-btn {
          padding: 10px;
          background: #ef4444;
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

        .request-item {
          background: #fef2f2;
          padding: 10px;
          border-left: 4px solid #ef4444;
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
          background: #fee2e2;
          color: #991b1b;
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

export default RecipientDashboard;