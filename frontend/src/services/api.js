const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const createProfile = async (data) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const updateProfile = async (data) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const addLink = async (linkData) => {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(linkData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const updateLink = async (linkId, linkData) => {
  const response = await fetch(`${API_BASE_URL}/links/${linkId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(linkData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const deleteLink = async (linkId) => {
  const response = await fetch(`${API_BASE_URL}/links/${linkId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const reorderLinks = async (links) => {
  const response = await fetch(`${API_BASE_URL}/links/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ links })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const redirectLink = (linkId) => {
  return `${API_BASE_URL}/redirect/${linkId}`;
};

export const adminLogin = async (password) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
};