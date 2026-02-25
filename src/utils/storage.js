export const STORAGE_KEYS = {
  USERS: 'relief_hub_users',
  DRIVES: 'relief_hub_drives',
  DONATIONS: 'relief_hub_donations',
  REQUESTS: 'relief_hub_requests',
  SHIPMENTS: 'relief_hub_shipments'
};

export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};