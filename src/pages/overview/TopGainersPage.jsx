import { useEffect, useMemo } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function TopGainersPage() {
  const { markets, refresh, loading } = useApp();
  const topGainers = useMemo(() => [...markets].filter(Boolean).sort((a, b) => b.change24 - a.change24).slice(0, 10), [markets]);

  useEffect(() => {
    API.getMarkets();
  }, []);

  if (loading) return <div className="page-content"><GlassCard><div className="skeleton-grid" /></GlassCard></div>;

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Top Gainers</h1>
        <p className="page-subtitle">Simulated assets with the highest 24-hour price increase, sorted by percentage change</p>
      </GlassCard>

      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Rank</div>
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">Market Cap</div>
            <div className="table-cell table-header-cell sortable">24h Change</div>
            <div className="table-cell table-header-cell">Volume (24h)</div>
            <div className="table-cell table-header-cell">Circulating Supply</div>
          </div>
          {topGainers.map((a, i) => (
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
              <div className="table-cell text-success">+{a.change24.toFixed(2)}%</div>
              <div className="table-cell">${(a.volume24 / 1000000).toFixed(2)}M</div>
              <div className="table-cell">{(a.circulatingSupply / 1000000000).toFixed(3)}B</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <GlassCard>
          <div className="card-chart-header">
            <h3>Gainer Distribution</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Change Range</div>
                <div className="table-cell table-header-cell">Count</div>
              </div>
              {topGainers.slice(0, 5).map((a, i) => (
                <div key={a.id} className="table-row">
                  <div className="table-cell">{i === 4 ? 'Top 5' : `Gainer ${i + 1}`}</div>
                  <div className="table-cell">1</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="card-chart-header">
            <h3>Watchlist</h3>
          </div>
          {[]}
        </GlassCard>
      </div>
    </div>
  );
}
