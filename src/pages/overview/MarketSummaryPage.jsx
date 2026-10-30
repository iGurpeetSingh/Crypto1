import { useEffect, useMemo, useState } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import { useApp } from '../../context/AppContext';

export default function MarketSummaryPage() {
  const { markets, refresh, loading } = useApp();
  const [summary, setSummary] = useState({ totalMarketCap: 0, totalVolume: 0, avgChange: 0, assetCount: 0 });

  useEffect(() => {
    const filtered = markets.filter(Boolean);
    const totalMarketCap = filtered.reduce((s, a) => s + (a.marketCap || 0), 0);
    const totalVolume = filtered.reduce((s, a) => s + (a.volume24 || 0), 0);
    const avgChange = filtered.length ? filtered.reduce((s, a) => s + a.change24, 0) / filtered.length : 0;
    setSummary({ totalMarketCap, totalVolume, avgChange, assetCount: filtered.length });
  }, [markets]);

  if (loading) return <div className="page-content"><GlassCard><div className="skeleton-grid" /></GlassCard></div>;

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Market Summary</h1>
        <p className="page-subtitle">Aggregated market data computed from the live local dataset</p>
      </GlassCard>

      <div className="grid grid-4">
        <MetricCard label="Total Market Cap" value={`$${(summary.totalMarketCap / 1000000000).toFixed(2)}B`} subtitle={`Across ${summary.assetCount} assets`} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M12 6v12"/><path d="M6 12h12"/></svg>} accent="#C084FC" loading={loading} />
        <MetricCard label="24h Volume" value={`$${(summary.totalVolume / 1000000).toFixed(2)}M`} subtitle="Simulated 24h trading volume" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} accent="#FF5CA8" loading={loading} />
        <MetricCard label="Avg 24h Change" value={`${summary.avgChange >= 0 ? '+' : ''}${summary.avgChange.toFixed(2)}%`} subtitle="Average across all assets" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M12 2v20"/></svg>} accent="#42DDAA" loading={loading} />
        <MetricCard label="Top Mover" value={summary.assetCount ? `${(markets.filter(Boolean).sort((a,b)=>b.change24-a.change24)[0]?.symbol || 'N/A')}` : 'N/A'} subtitle={`${markets.filter(Boolean).sort((a,b)=>b.change24-a.change24)[0]?.name || ''}`} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>} accent="#FF9ECF" loading={loading} />
      </div>

      <GlassCard style={{ marginTop: '20px' }}>
        <div className="card-chart-header">
          <h3>Market Distribution by Category</h3>
        </div>
        <div className="table-wrapper">
          <div className="table">
            <div className="table-header">
              <div className="table-cell table-header-cell">Category</div>
              <div className="table-cell table-header-cell">Assets</div>
              <div className="table-cell table-header-cell">Market Cap</div>
              <div className="table-cell table-header-cell">Avg Change</div>
            </div>
            {Object.entries(
              markets.filter(Boolean).reduce((acc, a) => {
                if (!acc[a.category]) acc[a.category] = { count: 0, marketCap: 0, changeSum: 0 };
                acc[a.category].count++;
                acc[a.category].marketCap += a.marketCap || 0;
                acc[a.category].changeSum += a.change24;
                return acc;
              }, {})
            ).map(([cat, v]) => (
              <div key={cat} className="table-row">
                <div className="table-cell">{cat}</div>
                <div className="table-cell">{v.count}</div>
                <div className="table-cell">${(v.marketCap / 1000000000).toFixed(2)}B</div>
                <div className="table-cell">${(v.changeSum / v.count).toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
