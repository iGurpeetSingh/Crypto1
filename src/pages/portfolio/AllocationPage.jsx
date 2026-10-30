import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function AllocationPage() {
  const { portfolio, markets } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try { await Promise.all([API.getHoldings(), API.getMarkets()]); } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const assets = portfolio.assets || [];
  const total = assets.reduce((s, a) => s + (a.quantity || 0) * (markets.find(m=>m.id===a.id)?.price || 0), 0) || 1;

  if (!assets.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Allocation</h1>
          <p className="page-subtitle">Portfolio allocation by asset</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <h3>No holdings yet</h3>
          <p>Build your portfolio to see allocations.</p>
          <button onClick={() => navigate('/trading')} className="btn btn--primary">Trade</button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Allocation</h1>
        <p className="page-subtitle">Portfolio allocation by asset, shown as percentages and a visual breakdown</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Quantity</div>
            <div className="table-cell table-header-cell">Value</div>
            <div className="table-cell table-header-cell">Allocation</div>
          </div>
          {assets.map((a) => {
            const asset = markets.find((m) => m.id === a.id);
            const val = (a.quantity || 0) * (asset?.price || 0);
            const pct = (val / total) * 100;
            return (
              <div key={a.id} className="table-row">
                <div className="table-cell">{asset?.name}</div>
                <div className="table-cell">{a.quantity?.toFixed(4)}</div>
                <div className="table-cell">${val.toLocaleString()}</div>
                <div className="table-cell">{pct.toFixed(2)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

