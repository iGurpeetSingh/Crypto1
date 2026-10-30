import { useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function OrderHistoryPage() {
  const { orders, markets, refresh } = useApp();

  useEffect(() => {
    async function load() {
      try { await API.getOrders(); } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const allOrders = orders || [];
  const sorted = useMemo(() => [...allOrders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), [allOrders]);

  if (!sorted.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Order History</h1>
          <p className="page-subtitle">Complete record of your simulated trading orders</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <h3>No orders yet</h3>
          <p>Place buy or sell orders to see your order history.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Order History</h1>
        <p className="page-subtitle">All simulated buy and sell orders, sorted by most recent</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Order ID</div>
            <div className="table-cell table-header-cell">Time</div>
            <div className="table-cell table-header-cell">Type</div>
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Quantity</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">Total</div>
            <div className="table-cell table-header-cell">Status</div>
          </div>
          {sorted.map((o) => (
            <div key={o.id} className="table-row">
              <div className="table-cell">{o.id?.substring(0, 8)}...</div>
              <div className="table-cell">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="table-cell">{o.type}</div>
              <div className="table-cell">{markets.find((m) => m.id === o.assetId)?.symbol || o.assetId}</div>
              <div className="table-cell">{o.quantity?.toFixed(4)}</div>
              <div className="table-cell">${o.price?.toFixed(4)}</div>
              <div className="table-cell">${o.total?.toFixed(2)}</div>
              <div className={`table-cell text-${o.status === 'completed' ? 'success' : 'danger'}`}>{o.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
