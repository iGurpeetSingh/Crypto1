const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('demo_token');
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  const response = await fetch(url, config);
  if (response.status === 401) {
    localStorage.removeItem('demo_token');
    window.location.href = '/login';
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${response.status}`);
  }
  return response.json();
}

const API = {
  health: () => request('/health'),

  getMarkets: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/markets?${search}`);
  },
  getMarket: (id) => request(`/markets/${id}`),
  getMarketBySymbol: (symbol) => request(`/markets/symbol/${symbol}`),
  simulatePrice: () => request('/markets/simulate', { method: 'POST' }),

  getPortfolio: () => request('/portfolio'),
  getHoldings: () => request('/portfolio/holdings'),

  placeOrder: (order) => request('/orders/buy', { method: 'POST', body: JSON.stringify(order) }),
  placeSellOrder: (order) => request('/orders/sell', { method: 'POST', body: JSON.stringify(order) }),
  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),

  getWallet: () => request('/wallet'),
  getBalance: () => request('/wallet/balance'),
  getAccounts: () => request('/wallet/accounts'),
  getAccount: (id) => request(`/wallet/accounts/${id}`),
  deposit: (data) => request('/wallet/deposit', { method: 'POST', body: JSON.stringify(data) }),
  withdraw: (data) => request('/wallet/withdraw', { method: 'POST', body: JSON.stringify(data) }),
  transfer: (data) => request('/wallet/transfer', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/wallet/history?${search}`);
  },
  getTransaction: (id) => request(`/wallet/history/${id}`),

  getAlerts: () => request('/alerts'),
  getAlert: (id) => request(`/alerts/${id}`),
  createAlert: (data) => request('/alerts', { method: 'POST', body: JSON.stringify(data) }),
  updateAlert: (id, data) => request(`/alerts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAlert: (id) => request(`/alerts/${id}`, { method: 'DELETE' }),
  triggerAlerts: () => request('/alerts/trigger', { method: 'POST' }),

  getReports: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return request(`/reports/transactions?${search}`);
  },
  exportCsv: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/reports/export/csv?${search}`).then((r) => r.blob());
  },
  exportJson: (params = {}) => {
    const search = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/reports/export/json?${search}`).then((r) => r.json());
  },
  exportPortfolio: () => fetch(`${API_BASE}/reports/portfolio/export`).then((r) => r.blob()),

  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PATCH', body: JSON.stringify(data) }),

  resetDemo: () => request('/demo/reset', { method: 'POST', body: JSON.stringify({ confirm: 'I confirm' }) }),

  getDemoAssets: () => request('/assets'),
};

export default API;
