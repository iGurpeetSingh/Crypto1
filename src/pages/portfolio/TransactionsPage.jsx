import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../../components/common/GlassCard';

export default function TransactionsPage() {
  const { transactions } = useApp();

  useEffect(() => {
    API.getHistory();
  }, []);

  const txs = transactions || [];
  const sorted = [...txs].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (!sorted.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Transactions</h1>
          <p className="page-subtitle">Your account transaction history</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <h3>No transactions</h3>
          <p>Start trading to see your transaction history.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Transactions</h1>
        <p className="page-subtitle">All your simulated transaction history, sorted by date</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Time</div>
            <div className="table-cell table-header-cell">Type</div>
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Quantity</div>
            <div className="table-cell table-header-cell">Fee</div>
            <div className="table-cell table-header-cell">Total</div>
            <div className="table-cell table-header-cell">Status</div>
          </div>
          {sorted.map((t) => (
            <div key={t.id} className="table-row">
              <div className="table-cell">{new Date(t.createdAt).toLocaleString()}</div>
              <div className="table-cell">{t.label}</div>
              <div className="table-cell">{t.assetId ? (t.assetId.substring(0, 4) + '...') : '—'}</div>
              <div className="table-cell">{t.quantity ? t.quantity.toFixed(4) : '—'}</div>
              <div className="table-cell">${t.fee?.toFixed(2) || '0.00'}</div>
              <div className="table-cell">${t.total?.toFixed(2) || '0.00'}</div>
              <div className="table-cell text-success">{t.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
