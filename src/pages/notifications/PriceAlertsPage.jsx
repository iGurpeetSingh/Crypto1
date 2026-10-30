import { useEffect } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function PriceAlertsPage() {
  const { alerts } = useApp();

  useEffect(() => { API.getAlerts(); }, []);

  if (!alerts.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header"><h1>Price Alerts</h1></GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/></svg>
          <h3>No price alerts set</h3>
        </GlassCard>
      </div>
    );
  }

  const rows = alerts.map((a) => (
    <div key={a.id} className="table-row">
      <div className="table-cell">{a.assetId}</div>
      <div className="table-cell">{a.condition}</div>
      <div className="table-cell">${a.price?.toFixed(2)}</div>
      <div className="table-cell text-success">{a.status}</div>
    </div>
  ));

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Price Alerts</h1><p className="page-subtitle">Your simulated price alerts</p></GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Condition</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">Status</div>
          </div>
          {rows}
        </div>
      </div>
    </div>
  );
}
