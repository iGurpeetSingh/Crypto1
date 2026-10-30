import { useEffect, useMemo } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function ClosedOrdersPage() {
  const { orders } = useApp();

  useEffect(() => {
    API.getOrders();
  }, []);

  const closedOrders = useMemo(() => (orders || []).filter((o) => o.status === 'completed' || o.status === 'cancelled'), [orders]);

  if (!closedOrders.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Closed Orders</h1>
          <p className="page-subtitle">Completed or cancelled simulated orders</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 21L3 16M8 21V5M16 3L21 8M16 3V16"/></svg>
          <h3>No closed orders</h3>
          <p>Completed orders will appear here.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Closed Orders</h1>
        <p className="page-subtitle">Completed and cancelled simulated orders</p>
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
          {closedOrders.map((o) => (
            <div key={o.id} className="table-row">
              <div className="table-cell">{o.id?.substring(0, 8)}...</div>
              <div className="table-cell">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="table-cell">{o.type}</div>
              <div className="table-cell">{o.symbol || o.assetId}</div>
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
