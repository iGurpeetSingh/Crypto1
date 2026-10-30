import { useEffect } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function HistoryPage() {
  const { transactions } = useApp();

  useEffect(() => { API.getHoldings(); }, []);

  const txs = transactions || [];

  if (!txs.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Portfolio History</h1>
          <p className="page-subtitle">Historical view of your portfolio changes over time</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          <h3>No history</h3>
        </GlassCard>
      </div>
    );
  }

  const rows = txs.map((t) => (
    <div key={t.id} className="table-row">
      <div className="table-cell">{new Date(t.createdAt).toLocaleDateString()}</div>
      <div className="table-cell">{t.label || t.type}</div>
      <div className="table-cell">{t.assetId || '—'}</div>
      <div className="table-cell">${t.price?.toFixed(4) || '—'}</div>
      <div className="table-cell">${t.total?.toFixed(2) || '—'}</div>
      <div className="table-cell">${t.fee?.toFixed(2) || '0.00'}</div>
      <div className="table-cell">{t.status || 'completed'}</div>
    </div>
  ));

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Portfolio History</h1></GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Date</div>
            <div className="table-cell table-header-cell">Type</div>
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Qty</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">Total</div>
            <div className="table-cell table-header-cell">Status</div>
          </div>
          {rows}
        </div>
      </div>
    </div>
  );
}
