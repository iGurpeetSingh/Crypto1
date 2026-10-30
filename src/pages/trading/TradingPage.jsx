import { useEffect } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function TradingPage() {
  const { orders } = useApp();

  useEffect(() => {
    API.getMarkets();
  }, []);

  const recentOrders = (orders || []).slice(0, 5);

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Trading Simulator</h1>
        <p className="page-subtitle">Simulated spot trading — all orders are local demo operations with no real exchange integration</p>
      </GlassCard>

      <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="grid grid-3">
          <button className="btn btn--primary" style={{ width: '100%' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            Demo Buy Order
          </button>
          <button className="btn btn--secondary" style={{ width: '100%' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M12 2l10 5-10 5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            Demo Sell Order
          </button>
          <button className="btn btn--ghost" style={{ width: '100%' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M12 2v20M12 12L18 6M12 12L6 6"/></svg>
            Asset Conversion
          </button>
        </div>

        <div className="card-chart-header" style={{ marginTop: '16px' }}>
          <h3>Recent Orders</h3>
        </div>
        {recentOrders.length ? (
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Order ID</div>
                <div className="table-cell table-header-cell">Type</div>
                <div className="table-cell table-header-cell">Asset</div>
                <div className="table-cell table-header-cell">Quantity</div>
                <div className="table-cell table-header-cell">Status</div>
              </div>
              {recentOrders.map((o) => (
                <div key={o.id} className="table-row">
                  <div className="table-cell">{o.id?.substring(0, 8)}...</div>
                  <div className="table-cell">{o.type}</div>
                  <div className="table-cell">{o.symbol || o.assetId}</div>
                  <div className="table-cell">{o.quantity?.toFixed(4)}</div>
                  <div className={`table-cell text-${o.status === 'completed' ? 'success' : 'danger'}`}>{o.status}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto 16px', opacity: 0.4 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <p>No recent orders</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
