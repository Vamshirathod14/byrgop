const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || '';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (ADMIN_KEY) headers['x-admin-key'] = ADMIN_KEY;
  const res = await fetch(`${API_BASE}${path}`, { headers, ...options });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

const json = (method) => (path, payload) =>
  request(path, { method, body: JSON.stringify(payload) });

const del = (path) => request(path, { method: 'DELETE' });

export const api = {
  stats: () => request('/admin/stats'),
  sessions: (status) => request(`/admin/sessions${status ? `?status=${status}` : ''}`),
  getSession: (id) => request(`/admin/sessions/${id}`),

  categories: () => request('/admin/categories?includeInactive=true'),
  createCategory: json('POST'),
  updateCategory: json('PUT'),
  deleteCategory: del,

  stages: () => request('/admin/stages?includeInactive=true'),
  createStage: json('POST'),
  updateStage: json('PUT'),
  deleteStage: del,

  questions: (category) =>
    request(`/admin/questions?includeInactive=true${category ? `&category=${category}` : ''}`),
  createQuestion: json('POST'),
  updateQuestion: json('PUT'),
  deleteQuestion: del,

  results: () => request('/admin/results?includeInactive=true'),
  createResult: json('POST'),
  updateResult: json('PUT'),
  deleteResult: del,
};

export default api;
