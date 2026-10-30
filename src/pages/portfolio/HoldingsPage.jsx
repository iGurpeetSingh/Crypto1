import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function HoldingsPage() {
  const { portfolio, markets, refresh } = useApp();
  const navigate = useNavigate();

  const holdings = portfolio.assets || [];
  const sorted = useMemo(() => {
    return [...holdings].sort((a, b) => (b.quantity * (markets.find(m=>m.id===b.id)?.price || 0)) - (a.quantity * (markets.find(m=>m.id===a.id)?.price || 0)));
  }, [holdings, markets]);

  useEffect(() => {
    async function load() {
      try { await Promise.all([API.getHoldings(), API.getMarkets()]); } catch (e) { console.error(e); }
    }
    load();
  }, []);

  if (!sorted.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Holdings</h1>
          <p className="page-subtitle">Your current asset positions with quantity, value, and profit/loss</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <h3>No holdings yet</h3>
          <p>Start trading to build your simulated portfolio.</p>
          <button onClick={() => navigate('/trading')} className="btn btn--primary">Buy Now</button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Holdings</h1>
        <p className="page-subtitle">Your current asset positions with quantity, value, and profit/loss</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Quantity</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">Value</div>
            <div className="table-cell table-header-cell">Avg Cost</div>
            <div className="table-cell table-header-cell">PnL</div>
          </div>
          {sorted.map((h) => {
            const asset = markets.find((m) => m.id === h.id);
            const value = (h.quantity || 0) * (asset?.price || 0);
            const pl = value - (h.quantity || 0) * (h.avgBuyPrice || 0);
            return (
              <div key={h.id} className="table-row">
                <div className="table-cell">
                  <div className="asset-cell">
                    <span className="asset-icon">{asset?.symbol?.charAt(0) || ''}</span>
                    <span>{asset?.name || h.id} ({asset?.symbol || ''})</span>
                  </div>
                </div>
                <div className="table-cell">{h.quantity?.toFixed(4)}</div>
                <div className="table-cell">${asset?.price?.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                <div className="table-cell">${value.toLocaleString()}</div>
                <div className="table-cell">${h.avgBuyPrice?.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                <div className={`table-cell text-${pl >= 0 ? 'success' : 'danger'}`}>{pl >= 0 ? '+' : ''}{pl.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Allocation</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Asset</div>
                <div className="table-cell table-header-cell">Pct</div>
              </div>
              {sorted.slice(0, 8).map((h) => {
                const total = sorted.reduce((s, a) => s + (a.quantity || 0) * (markets.find(m=>m.id===a.id)?.price || 0), 0);
                const pct = total > 0 ? ((h.quantity || 0) * (markets.find(m=>m.id===h.id)?.price || 0) / total) * 100 : 0;
                return <div key={h.id} className="table-row"><div className="table-cell">{markets.find(m=>m.id===h.id)?.name || h.id}</div><div className="table-cell">{pct.toFixed(1)}%</div></div>;
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Summary</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Metric</div>
                <div className="table-cell table-header-cell">Value</div>
              </div>
              <div className="table-row"><div className="table-cell">Holdings</div><div className="table-cell">{sorted.length}</div></div>
              <div className="table-row"><div className="table-cell">Value</div><div className="table-cell">${portfolio.totalValue?.toLocaleString()}</div></div>
              <div className="table-row"><div className="table-cell">PnL</div><div className={`table-cell text-${portfolio.totalPl >= 0 ? 'success' : 'danger'}`}>${portfolio.totalPl?.toFixed(2)}</div></div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
