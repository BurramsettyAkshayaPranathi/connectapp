export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    const isLocalBackend = API_BASE_URL.includes('localhost:8080') || API_BASE_URL.includes('127.0.0.1:8080');

    if (isLocalBackend) {
      throw new Error(
        `Cannot connect to backend at ${API_BASE_URL}. Start your Spring Boot server on port 8080 and make sure MySQL is running.`
      );
    }

    throw new Error(`Network error while contacting ${API_BASE_URL}${path}`);
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      // Ignore JSON parse failures and fall back to status-based message.
    }

    throw new Error(message);
  }

  return response.json();
}

function normalizeUser(user) {
  return {
    ...user,
    role: user.role?.toLowerCase?.() || user.role
  };
}

export async function fetchAdminSummary() {
  return apiRequest('/api/admin-summary');
}

export async function signupUser(payload) {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      role: payload.role.toUpperCase()
    })
  });
}

export async function loginUser(payload) {
  const user = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      role: payload.role.toUpperCase()
    })
  });

  return normalizeUser(user);
}

export async function verifySignupOtp(payload) {
  return apiRequest('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function resendSignupOtp(payload) {
  return apiRequest('/api/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function submitFeedback(payload) {
  return apiRequest('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function fetchUsers() {
  return apiRequest('/api/users');
}

export function fetchDrives() {
  return apiRequest('/api/drives');
}

export function fetchDrivesByUser(email) {
  return apiRequest(`/api/drives/user/${encodeURIComponent(email)}`);
}

export function createDrive(payload) {
  return apiRequest('/api/drives', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      category: payload.category.toUpperCase(),
      priority: payload.priority.toUpperCase()
    })
  });
}

export function fetchDonations() {
  return apiRequest('/api/donations');
}

export function fetchDonationsByUser(email) {
  return apiRequest(`/api/donations/user/${encodeURIComponent(email)}`);
}

export function createDonation(payload) {
  const requestBody = {
    ...payload,
    category: payload.category.toUpperCase()
  };

  if (payload.priority) {
    requestBody.priority = payload.priority.toUpperCase();
  }

  return apiRequest('/api/donations', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  });
}

export function fetchRequests() {
  return apiRequest('/api/requests');
}

export function fetchRequestsByUser(email) {
  return apiRequest(`/api/requests/user/${encodeURIComponent(email)}`);
}

export function createRequest(payload) {
  return apiRequest('/api/requests', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      category: payload.category.toUpperCase(),
      priority: payload.priority.toUpperCase()
    })
  });
}

export function fetchShipments() {
  return apiRequest('/api/shipments');
}

export function fetchShipmentsByUser(email) {
  return apiRequest(`/api/shipments/user/${encodeURIComponent(email)}`);
}

export function createShipment(payload) {
  return apiRequest('/api/shipments', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      status: payload.status.toUpperCase()
    })
  });
}
