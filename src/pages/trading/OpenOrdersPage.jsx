import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function OpenOrdersPage() {
  const { orders } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    API.getOrders();
  }, []);

  const openOrders = (orders || []).filter((o) => o.status === 'open' || o.status === 'pending');

  if (!openOrders.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Open Orders</h1>
          <p className="page-subtitle">View active orders waiting to be filled</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <h3>No open orders</h3>
          <p>Place buy or sell orders to see them here.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Open Orders</h1>
        <p className="page-subtitle">Active simulated orders waiting to be filled</p>
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
          </div>
          {openOrders.map((o) => (
            <div key={o.id} className="table-row">
              <div className="table-cell">{o.id?.substring(0, 8)}...</div>
              <div className="table-cell">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="table-cell">{o.type}</div>
              <div className="table-cell">{o.symbol || o.assetId}</div>
              <div className="table-cell">{o.quantity?.toFixed(4)}</div>
              <div className="table-cell">${o.price?.toFixed(4)}</div>
              <div className="table-cell">${o.total?.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
