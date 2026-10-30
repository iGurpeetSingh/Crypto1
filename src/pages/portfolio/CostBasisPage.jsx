import { useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function CostBasisPage() {
  const { portfolio, markets } = useApp();

  useEffect(() => {
    API.getHoldings();
    API.getMarkets();
  }, []);

  const assets = portfolio.assets || [];
  const totals = useMemo(() => {
    let totalQty = 0;
    let totalCost = 0;
    assets.forEach((a) => {
      const asset = markets.find((m) => m.id === a.id);
      const qty = a.quantity || 0;
      const cost = qty * (a.avgBuyPrice || 0);
      totalQty += qty;
      totalCost += cost;
    });
    return { totalQty, totalCost };
  }, [portfolio, markets]);

  if (!assets.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Average Cost Basis</h1>
          <p className="page-subtitle">Calculate your average buy price per asset</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <h3>No holdings</h3>
          <p>Buy assets to see your cost basis.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Average Cost Basis</h1>
        <p className="page-subtitle">The average buy price per asset across all acquired lots</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Quantity</div>
            <div className="table-cell table-header-cell">Avg Buy Price</div>
            <div className="table-cell table-header-cell">Total Cost</div>
            <div className="table-cell table-header-cell">Current Value</div>
            <div className="table-cell table-header-cell">Unrealized PnL</div>
          </div>
          {assets.map((a) => {
            const asset = markets.find((m) => m.id === a.id);
            const qty = a.quantity || 0;
            const avgCost = a.avgBuyPrice || 0;
            const totalCost = qty * avgCost;
            const value = qty * (asset?.price || 0);
            const pnl = value - totalCost;
            return (
              <div key={a.id} className="table-row">
                <div className="table-cell">{asset?.name}</div>
                <div className="table-cell">{qty.toFixed(4)}</div>
                <div className="table-cell">${avgCost.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                <div className="table-cell">${totalCost.toLocaleString()}</div>
                <div className="table-cell">${value.toLocaleString()}</div>
                <div className={`table-cell text-${pnl >= 0 ? 'success' : 'danger'}`}>${pnl.toFixed(2)}</div>
              </div>
            );
          })}
          <div className="table-row">
            <div className="table-cell"><strong>Total</strong></div>
            <div className="table-cell"><strong>{totals.totalQty.toFixed(4)}</strong></div>
            <div className="table-cell"></div>
            <div className="table-cell"><strong>${totals.totalCost.toLocaleString()}</strong></div>
            <div className="table-cell"><strong>${totals.totalQty * (markets.reduce((s, m) => s + (m.price || 0) * (portfolio.assets?.find(a => a.id === m.id)?.quantity || 0), 0) || 0).toLocaleString()}</strong></div>
            <div className="table-cell"><strong>${(totals.totalQty * (markets.reduce((s, m) => s + (m.price || 0) * (portfolio.assets?.find(a => a.id === m.id)?.quantity || 0), 0)) - totals.totalCost).toFixed(2)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
