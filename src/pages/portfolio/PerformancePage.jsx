import { useEffect, useMemo } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function PerformancePage() {
  const { portfolio, markets, refresh } = useApp();

  useEffect(() => {
    async function load() {
      try { await Promise.all([API.getHoldings(), API.getMarkets()]); } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const assets = portfolio.assets || [];
  const totalValue = assets.reduce((s, a) => s + (a.quantity || 0) * (markets.find(m=>m.id===a.id)?.price || 0), 0) || 0;
  const totalBase = assets.reduce((s, a) => s + (a.quantity || 0) * (a.avgBuyPrice || 0), 0) || 1;
  const pl = totalValue - totalBase;
  const plPct = ((pl / totalBase) * 100).toFixed(2);

  if (!assets.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Performance</h1>
          <p className="page-subtitle">Portfolio performance tracking</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
          <h3>No data yet</h3>
          <p>Track your portfolio performance as you trade.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Performance</h1>
        <p className="page-subtitle">Simulated portfolio performance over time</p>
      </GlassCard>

      <div className="grid grid-3" style={{ marginTop: '20px' }}>
        <GlassCard>
          <div className="card-chart-header"><h3>Total Value</h3></div>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Total Value</div><div className="table-cell">${totalValue.toLocaleString()}</div></div></div></div>
        </GlassCard>
        <GlassCard>
          <div className="card-chart-header"><h3>Cost Basis</h3></div>
          <div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Cost Basis</div><div className="table-cell">${totalBase.toLocaleString()}</div></div></div></div>
        </GlassCard>
        <GlassCard>
          <div className="card-chart-header"><h3>PnL</h3></div>
          <div className="table-wrapper"><div className="table"><div className={`table-row`}><div className={`table-cell text-${pl >= 0 ? 'success' : 'danger'}`}>PnL</div><div className={`table-cell text-${pl >= 0 ? 'success' : 'danger'}`}>${pl.toFixed(2)} ({plPct}%)</div></div></div></div>
        </GlassCard>
      </div>

      <GlassCard style={{ marginTop: '20px' }}>
        <div className="card-chart-header"><h3>Asset Performance</h3></div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Asset</div>
              <div className="table-cell table-header-cell">Current Value</div>
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
