const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

export const api = {
  startAssessment: () => request('/assessments', { method: 'POST' }),
  nextQuestion: (sessionId, category) => request(`/assessments/${sessionId}/next/${category}`),
  submitAnswer: (sessionId, payload) =>
    request(`/assessments/${sessionId}/answer`, { method: 'POST', body: JSON.stringify(payload) }),
  reportTimeout: (sessionId, payload) =>
    request(`/assessments/${sessionId}/timeout`, { method: 'POST', body: JSON.stringify(payload) }),
  getResult: (sessionId) => request(`/assessments/${sessionId}/result`),

  // Filtered server-side by the BusinessType → Domain relationship.
  domains: (businessTypeKey) =>
    request(`/domains${businessTypeKey ? `?businessType=${encodeURIComponent(businessTypeKey)}` : ''}`),
  kyMeta: () => request('/know-yourself/meta'),
  startKY: () => request('/know-yourself', { method: 'POST' }),
  startKYAssignment: (payload) =>
    request('/know-yourself/assignment', { method: 'POST', body: JSON.stringify(payload) }),
  kyQuestion: (sessionId, index) => request(`/know-yourself/${sessionId}/question/${index}`),
  submitKYAnswer: (sessionId, payload) =>
    request(`/know-yourself/${sessionId}/answer`, { method: 'POST', body: JSON.stringify(payload) }),
  kyResult: (sessionId) => request(`/know-yourself/${sessionId}/result`),
  submitKYContact: (sessionId, payload) =>
    request(`/know-yourself/${sessionId}/contact`, { method: 'POST', body: JSON.stringify(payload) }),
  submitKYProBono: (sessionId, payload) =>
    request(`/know-yourself/${sessionId}/pro-bono`, { method: 'POST', body: JSON.stringify(payload) }),
  submitContact: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  bulkUploadKYQuestions: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/admin/know-yourself/bulk-upload', { method: 'POST', body: formData });
  },
};

export default api;
