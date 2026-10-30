import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import PriceChart from '../../components/charts/PriceChart';
import { useApp } from '../../context/AppContext';

export default function MarketOverviewPage() {
  const { markets, watchlist, refresh, loading } = useApp();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const btc = markets.find((a) => a.symbol === 'BTC');
    setChartData(btc?.history?.slice(-30) || []);
  }, [markets]);

  const watchlistIds = watchlist.map((w) => w.assetId);
  const topGainers = useMemo(() => [...markets].filter(Boolean).sort((a, b) => b.change24 - a.change24).slice(0, 5), [markets]);
  const topLosers = useMemo(() => [...markets].filter(Boolean).sort((a, b) => a.change24 - b.change24).slice(0, 5), [markets]);

  if (loading) return <div className="page-content"><GlassCard><div className="skeleton-grid" /></GlassCard></div>;

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Market Overview</h1>
        <p className="page-subtitle">Summary of the simulated cryptocurrency market across all tracked assets</p>
      </GlassCard>

      <div className="grid grid-4">
        <MetricCard label="Total Assets" value={markets.filter(Boolean).length} subtitle="Tracked simulated assets" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>} accent="#C084FC" loading={loading} />
        <MetricCard label="Market Categories" value={new Set(markets.filter(Boolean).map(a => a.category)).size} subtitle="Unique asset categories" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} accent="#FF5CA8" loading={loading} />
        <MetricCard label="Watchlist Count" value={watchlistIds.length} subtitle="Assets you are watching" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} accent="#FF9ECF" loading={loading} />
        <MetricCard label="Avg 24h Change" value={`${markets.filter(Boolean).length ? ((markets.reduce((s, a) => s + a.change24, 0) / markets.filter(Boolean).length)) : 0}%`} subtitle="Average simulated daily change" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M12 2v20"/></svg>} accent="#42DDAA" loading={loading} />
      </div>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Market Cap Evolution</h3>
            <button className="btn btn--ghost btn--small" onClick={() => refresh()}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a8 8 0 0 0-8-8 8 8 0 0 0-4.7 1.6L3 13v5h5"/></svg>Refresh</button>
          </div>
          <PriceChart data={chartData} title="Market" height={240} />
        </GlassCard>

        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Top Gainers & Losers</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Asset</div>
                <div className="table-cell table-header-cell">Price</div>
                <div className="table-cell table-header-cell sortable">24h Change</div>
              </div>
              {[...topGainers, ...topLosers].map((a) => (
                <div key={a.id} className="table-row">
                  <div className="table-cell">
                    <div className="asset-cell">
                      <span className="asset-icon">{a.symbol.charAt(0)}</span>
                      <span>{a.name} ({a.symbol})</span>
                    </div>
                  </div>
                  <div className="table-cell">${a.price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
                  <div className={`table-cell text-${a.change24 >= 0 ? 'success' : 'danger'}`}>{a.change24 >= 0 ? '+' : ''}{a.change24.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
