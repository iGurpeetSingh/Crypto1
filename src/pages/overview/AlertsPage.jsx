import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function AlertsPage() {
  const { markets, alerts, showToast } = useApp();
  const navigate = useNavigate();
  const [localAlerts, setLocalAlerts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const a = await API.getAlerts();
        setLocalAlerts(a);
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  if (!alerts.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Price Alerts</h1>
          <p className="page-subtitle">Create price alerts to track simulated asset movements</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <h3>No price alerts yet</h3>
          <p>Create a price alert to track changes in simulated asset prices.</p>
          <button onClick={() => navigate('/notifications/create-alert')} className="btn btn--primary">
            Create Alert
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Price Alerts</h1>
        <p className="page-subtitle">Simulated market price alerts — these are local notifications, not real-time market alerts</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Type</div>
            <div className="table-cell table-header-cell">Target Price</div>
            <div className="table-cell table-header-cell">Current Price</div>
            <div className="table-cell table-header-cell">Status</div>
            <div className="table-cell table-header-cell">Actions</div>
          </div>
          {localAlerts.map((a) => {
            const asset = markets.find(m => m.id === a.assetId);
            return (
              <div key={a.id} className="table-row">
                <div className="table-cell">{asset?.name || a.assetId}</div>
                <div className="table-cell">{a.type}</div>
                <div className="table-cell">${a.targetPrice.toFixed(2)}</div>
                <div className="table-cell">${asset?.price ? asset.price.toFixed(2) : '—'}</div>
                <div className={`table-cell text-${a.enabled !== false ? 'success' : 'danger'}`}>{a.enabled !== false ? 'Active' : 'Disabled'}</div>
                <div className="table-cell">
                  <button className="btn btn--ghost btn--small" onClick={() => navigate(`/notifications/create-alert`)}>Edit</button>
                  <button className="btn btn--ghost btn--small" style={{ marginLeft: '8px' }}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
