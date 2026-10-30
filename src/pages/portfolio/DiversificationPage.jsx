import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';

export default function DiversificationPage() {
  const { portfolio, markets } = useApp();
  const navigate = useNavigate();

  useEffect(() => { API.getHoldings(); API.getMarkets(); }, []);

  const assets = portfolio.assets || [];
  const total = assets.reduce((s, a) => s + (a.quantity || 0) * (markets.find(m => m.id === a.id)?.price || 0), 0) || 1;
  const allocation = useMemo(() => assets.map((a) => {
    const asset = markets.find((m) => m.id === a.id);
    const val = (a.quantity || 0) * (asset?.price || 0);
    return { ...a, asset, value: val, pct: (val / total) * 100 };
  }), [portfolio.assets, markets, total]);

  const concentration = allocation.length > 0
    ? allocation.reduce((s, a) => s + Math.max(a.pct - (100 / allocation.length), 0), 0)
    : 0;

  if (!assets.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header"><h1>Diversification</h1><p className="page-subtitle">Analyze portfolio concentration</p></GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><circle cx="12" cy="12" r="3"/><path d="M12 1v22M1 12h22"/></svg>
          <h3>No holdings</h3>
          <button onClick={() => navigate('/trading')} className="btn btn--primary">Trade</button>
        </GlassCard>
      </div>
    );
  }

  const largestPct = allocation.reduce((s, a) => Math.max(s, a.pct), 0);
  const score = concentration > 30 ? 'Poor' : concentration > 15 ? 'Fair' : 'Excellent';
  const scoreClass = concentration > 30 ? 'danger' : concentration > 15 ? 'warning' : 'success';
  const action = concentration > 30 ? 'Add more diversification' : concentration > 15 ? 'Consider rebalancing' : 'Well diversified';

  const allocRows = allocation.map((a) => (
    <div key={a.id} className="table-row">
      <div className="table-cell">{a.asset.name}</div>
      <div className="table-cell">{a.pct.toFixed(1)}%</div>
    </div>
  ));

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Diversification Analysis</h1><p className="page-subtitle">Evaluate your portfolio concentration across asset categories</p></GlassCard>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="card-chart-header"><h3>Asset Allocation</h3></div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Asset</div>
                <div className="table-cell table-header-cell">%</div>
              </div>
              {allocRows}
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="card-chart-header"><h3>Concentration Risk</h3></div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-row">
                <div className="table-cell">Largest Position</div>
                <div className="table-cell">{largestPct.toFixed(1)}%</div>
              </div>
              <div className="table-row">
                <div className="table-cell">Concentration Penalty</div>
                <div className="table-cell">{concentration.toFixed(2)} pts</div>
              </div>
              <div className="table-row">
                <div className={`table-cell text-${scoreClass}`}>{score}</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="card-chart-header"><h3>Recommendations</h3></div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-row">
              <div className="table-cell">Action</div>
              <div className="table-cell">{action}</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
