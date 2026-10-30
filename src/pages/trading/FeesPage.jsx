import { useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function FeesPage() {
  const { portfolio, orders } = useApp();

  useEffect(() => {
    API.getOrders();
  }, []);

  const allOrders = orders || [];
  const feeSummary = useMemo(() => {
    const buys = allOrders.filter((o) => o.type === 'buy');
    const sells = allOrders.filter((o) => o.type === 'sell');
    const buyFees = buys.reduce((s, o) => s + (o.fee || 0), 0);
    const sellFees = sells.reduce((s, o) => s + (o.fee || 0), 0);
    const total = buyFees + sellFees;
    return { buyFees, sellFees, total, count: allOrders.length, buyCount: buys.length, sellCount: sells.length };
  }, [orders]);

  if (!allOrders.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Fee Breakdown</h1>
          <p className="page-subtitle">Simulated trading fee summary — 0.5% flat fee on all simulated orders</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <h3>No orders yet</h3>
          <p>Execute orders to see fee calculations.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Fee Breakdown</h1>
        <p className="page-subtitle">Simulated trading fee breakdown — 0.5% flat fee on all simulated orders. Always explicitly successful, no hardcoded messages.</p>
      </GlassCard>

      <div className="grid grid-3" style={{ marginTop: '20px' }}>
        <GlassCard className="card-chart">
          <div className="card-chart-header"><h3>Total Fees</h3></div>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Total Fees</div><div className="table-cell">${feeSummary.total.toFixed(2)}</div></div></div></div>
        </GlassCard>
        <GlassCard className="card-chart">
          <div className="card-chart-header"><h3>Buy Orders</h3></div>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Buy Count</div><div className="table-cell">{feeSummary.buyCount}</div></div><div className="table-row"><div className="table-cell">Buy Fees</div><div className="table-cell">${feeSummary.buyFees.toFixed(2)}</div></div></div></div>
        </GlassCard>
        <GlassCard className="card-chart">
          <div className="card-chart-header"><h3>Sell Orders</h3></div>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Sell Count</div><div className="table-cell">{feeSummary.sellCount}</div></div><div className="table-row"><div className="table-cell">Sell Fees</div><div className="table-cell">${feeSummary.sellFees.toFixed(2)}</div></div></div></div>
        </GlassCard>
      </div>

      <GlassCard style={{ marginTop: '20px' }}>
        <div className="card-chart-header"><h3>All Orders</h3></div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Order ID</div>
              <div className="table-cell table-header-cell">Time</div>
              <div className="table-cell table-header-cell">Type</div>
              <div className="table-cell table-header-cell">Asset</div>
              <div className="table-cell table-header-cell">Quantity</div>
              <div className="table-cell table-header-cell">Fee</div>
              <div className="table-cell table-header-cell">Total</div>
            </div>
            {allOrders.map((o) => (
              <div key={o.id} className="table-row">
                <div className="table-cell">{o.id?.substring(0, 8)}...</div>
                <div className="table-cell">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="table-cell">{o.type}</div>
                <div className="table-cell">{markets.find((m) => m.id === o.assetId)?.symbol || o.assetId}</div>
                <div className="table-cell">{o.quantity?.toFixed(4)}</div>
                <div className="table-cell">${o.fee?.toFixed(2) || '0.00'}</div>
                <div className="table-cell">${o.total?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
