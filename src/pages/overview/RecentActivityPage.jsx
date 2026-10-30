import { useEffect, useState, useMemo } from 'react';
import { format } from '../../utils/format';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function RecentActivityPage() {
  const { markets, transactions, refresh, loading } = useApp();
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const h = await API.getHistory();
        setTxs(h.items || h);
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const recent = useMemo(() => [...txs].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 15), [txs]);

  if (loading) return <div className="page-content"><GlassCard><div className="skeleton-grid" /></GlassCard></div>;

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Recent Activity</h1>
        <p className="page-subtitle">Latest simulated transactions across the platform</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Time</div>
            <div className="table-cell table-header-cell">Type</div>
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Quantity</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">Total</div>
            <div className="table-cell table-header-cell">Status</div>
          </div>
          {recent.map((t) => (
            <div key={t.id} className="table-row">
              <div className="table-cell">{format.date(t.createdAt)}</div>
              <div className="table-cell">{t.label}</div>
              <div className="table-cell">{t.assetId ? markets.find(m=>m.id===t.assetId)?.symbol || t.assetId : '—'}</div>
              <div className="table-cell">{t.quantity ? format.currency(t.quantity) : '—'}</div>
              <div className="table-cell">${t.price ? format.currency(t.price) : '—'}</div>
              <div className="table-cell">${t.total ? format.currency(t.total) : '—'}</div>
              <div className="table-cell text-success">{t.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
