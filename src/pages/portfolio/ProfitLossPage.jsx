import { useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../../components/common/GlassCard';

export default function ProfitLossPage() {
  const { portfolio, markets } = useApp();

  useEffect(() => {
    API.getHoldings();
    API.getMarkets();
  }, []);

  const assets = portfolio.assets || [];
  const summary = useMemo(() => {
    const realized = assets.reduce((s, a) => s + a.realizedPnl || 0, 0);
    const unrealized = assets.reduce((s, a) => {
      const asset = markets.find((m) => m.id === a.id);
      return s + ((asset?.price || 0) - (a.avgBuyPrice || 0)) * (a.quantity || 0);
    }, 0);
    const total = realized + unrealized;
    return { realized, unrealized, total, pct: total / totalBase * 100 };
  }, [portfolio, markets]);

  const totalBase = assets.reduce((s, a) => s + (a.quantity || 0) * (a.avgBuyPrice || 0), 0) || 1;

  if (!assets.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Profit & Loss</h1>
          <p className="page-subtitle">Track your realized and unrealized profit/loss</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
          <h3>No trading yet</h3>
          <p>Start trading to see your profit and loss tracking.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Profit & Loss</h1>
        <p className="page-subtitle">Simulated profit and loss tracking from actual local trading data</p>
      </GlassCard>

      <div className="grid grid-3">
        <GlassCard className="card-chart">
          <div className="card-chart-header"><h3>Realized</h3></div>
          <div className="table-wrapper"><div className="table"><div className={`table-row`}><div className="table-cell">Realized PnL</div><div className={`table-cell text-${summary.realized >= 0 ? 'success' : 'danger'}`}>${summary.realized.toFixed(2)}</div></div></div></div>
        </GlassCard>
        <GlassCard className="card-chart">
          <div className="card-chart-header"><h3>Unrealized</h3></div>
          <div className="table-wrapper"><div className="table"><div className={`table-row`}><div className="table-cell">Unrealized PnL</div><div className={`table-cell text-${summary.unrealized >= 0 ? 'success' : 'danger'}`}>${summary.unrealized.toFixed(2)}</div></div></div></div>
        </GlassCard>
        <GlassCard className="card-chart">
          <div className="card-chart-header"><h3>Total</h3></div>
          <div className="table-wrapper"><div className="table"><div className={`table-row`}><div className="table-cell">Total PnL</div><div className={`table-cell text-${summary.total >= 0 ? 'success' : 'danger'}`}>${summary.total.toFixed(2)} ({summary.pct.toFixed(2)}%)</div></div></div></div>
        </GlassCard>
      </div>

      <GlassCard style={{ marginTop: '20px' }}>
        <div className="card-chart-header"><h3>Asset-Level PnL</h3></div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Asset</div>
              <div className="table-cell table-header-cell">Quantity</div>
              <div className="table-cell table-header-cell">Value</div>
              <div className="table-cell table-header-cell">Cost Basis</div>
              <div className="table-cell table-header-cell">PnL</div>
            </div>
            {assets.map((a) => {
              const asset = markets.find((m) => m.id === a.id);
              const val = (a.quantity || 0) * (asset?.price || 0);
              const basis = (a.quantity || 0) * (a.avgBuyPrice || 0);
              const p = val - basis;
              return (
                <div key={a.id} className="table-row">
                  <div className="table-cell">{asset?.name}</div>
                  <div className="table-cell">{a.quantity?.toFixed(4)}</div>
                  <div className="table-cell">${val.toLocaleString()}</div>
                  <div className="table-cell">${basis.toLocaleString()}</div>
                  <div className={`table-cell text-${p >= 0 ? 'success' : 'danger'}`}>${p.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
