import { useEffect, useState } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const h = await API.getHistory();
        setHistory(h.items || h || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="page-content"><GlassCard><div className="skeleton-grid" /></GlassCard></div>;

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Wallet History</h1>
        <p className="page-subtitle">All wallet transactions including deposits, withdrawals, and transfers</p>
      </GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Date</div>
            <div className="table-cell table-header-cell">Type</div>
            <div className="table-cell table-header-cell">Amount</div>
            <div className="table-cell table-header-cell">Description</div>
            <div className="table-cell table-header-cell">Status</div>
          </div>
          {history.map((t) => (
            <div key={t.id} className="table-row">
              <div className="table-cell">{new Date(t.createdAt).toLocaleString()}</div>
              <div className="table-cell">{t.label}</div>
              <div className={`table-cell ${t.type === 'deposit' || t.type === 'transfer' ? 'text-success' : t.type === 'withdraw' ? 'text-danger' : ''}`}>${t.total?.toFixed(2) || '0.00'}</div>
              <div className="table-cell">{t.description || '—'}</div>
              <div className="table-cell text-success">{t.status}</div>
            </div>
          ))}
          {history.length === 0 && <div className="table-empty"><p>No history</p></div>}
        </div>
      </div>
    </div>
  );
}
