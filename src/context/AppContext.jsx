import { createContext, useContext, useState, useCallback,useEffect } from 'react';
import API from '../services/localBackend';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [markets, setMarkets] = useState([]);
  const [portfolio, setPortfolio] = useState({ totalValue: 0, totalBase: 0, totalPl: 0, assets: [] });
  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({ theme: 'pink-glass', accent: '#FF5CA8', currency: 'USD', locale: 'en-US', tableDensity: 'normal', notifications: { priceAlerts: true, orderUpdates: true, weeklyReport: false } });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [m, p, w, a, s] = await Promise.all([
        API.getMarkets(),
        API.getPortfolio(),
        API.getWatchlist(),
        API.getAlerts(),
        API.getSettings(),
      ]);
      setMarkets(m.items || m);
      setPortfolio(p);
      setWatchlist(w || []);
      setAlerts(a);
      setSettings(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  };

  const value = {
    markets,
    portfolio,
    watchlist,
    alerts,
    settings,
    loading,
    error,
    toasts,
    showToast,
    dismissToast,
    refresh: loadAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
