import { useEffect, useMemo } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function TrendingPage() {
  const { markets, refresh, loading } = useApp();
  const trending = useMemo(() => [...markets].filter(Boolean).sort((a, b) => Math.abs(b.change24) - Math.abs(a.change24)).slice(0, 10), [markets]);

  useEffect(() => {
    API.getMarkets();
  }, []);

  if (loading) return <div className="page-content"><GlassCard><div className="skeleton-grid" /></GlassCard></div>;

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Trending Assets</h1>
        <p className="page-subtitle">Assets with the highest simulated price volatility and engagement, ranked by absolute 24h change</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Rank</div>
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">Market Cap</div>
            <div className="table-cell table-header-cell">24h Change</div>
            <div className="table-cell table-header-cell">Volume (24h)</div>
            <div className="table-cell table-header-cell">Direction</div>
          </div>
          {trending.map((a, i) => (
            <div key={a.id} className="table-row">
              <div className="table-cell">{i + 1}</div>
              <div className="table-cell">
                <div className="asset-cell">
                  <span className="asset-icon">{a.symbol.charAt(0)}</span>
                  <span>{a.name} ({a.symbol})</span>
                </div>
              </div>
              <div className="table-cell">${a.price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
              <div className="table-cell">${(a.marketCap / 1000000000).toFixed(2)}B</div>
              <div className="table-cell">{a.change24 >= 0 ? '+' : ''}{a.change24.toFixed(2)}%</div>
              <div className="table-cell">${(a.volume24 / 1000000).toFixed(2)}M</div>
              <div className={`table-cell text-${a.change24 >= 0 ? 'success' : 'danger'}`}>
                {a.change24 >= 0 ? '▲ Gaining' : '▼ Losing'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <GlassCard style={{ marginTop: '20px' }}>
        <div className="card-chart-header">
          <h3>Trending Opportunity Heatmap</h3>
        </div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Asset</div>
              <div className="table-cell table-header-cell">Direction</div>
              <div className="table-cell table-header-cell">Momentum</div>
              <div className="table-cell table-header-cell">Signal</div>
              <div className="table-cell table-header-cell">Watchlist</div>
            </div>
            {trending.slice(0, 6).map((a) => (
              <div key={a.id} className="table-row">
                <div className="table-cell">{a.name} ({a.symbol})</div>
                <div className={`table-cell text-${a.change24 >= 0 ? 'success' : 'danger'}`}>{a.change24 >= 0 ? 'Positive' : 'Negative'}</div>
                <div className="table-cell">{Math.abs(a.change24) > 10 ? 'High' : Math.abs(a.change24) > 5 ? 'Medium' : 'Low'}</div>
                <div className="table-cell">
                  {Math.abs(a.change24) > 10 ? 'High potential' : Math.abs(a.change24) > 5 ? 'Moderate' : 'Low volatility'}
                </div>
                <div className="table-cell">
                  <button className="btn btn--ghost btn--small" onClick={() => {
                    // Add to watchlist
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12v6m-6-6h6M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                    {a.id ? 'Add' : ''}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
