import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import MetricCard from '../../components/cards/MetricCard';
import PriceChart from '../../components/charts/PriceChart';
import { useApp } from '../../context/AppContext';

export default function DashboardPage() {
  const { markets, portfolio, watchlist, refresh, loading } = useApp();
  const navigate = useNavigate();
  const [priceHistory, setPriceHistory] = useState([]);

  const totalValue = portfolio.totalValue || 0;
  const totalPl = portfolio.totalPl || 0;
  const totalBase = portfolio.totalBase || 0;
  const holdings = portfolio.assets || [];
  const plPercent = totalBase > 0 ? (totalPl / totalBase) * 100 : 0;

  const topGainers = useMemo(() => (markets || []).filter(Boolean).sort((a, b) => b.change24 - a.change24).slice(0, 5), [markets]);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, p] = await Promise.all([API.getMarkets(), API.getPortfolio()]);
        const btc = m.find((a) => a.symbol === 'BTC');
        if (btc) {
          setPriceHistory([btc.price, btc.price, btc.price, btc.price, btc.price, btc.price].map((v, i) => ({ price: v, date: i })));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const topLosers = useMemo(() => (markets || []).filter(Boolean).sort((a, b) => a.change24 - b.change24).slice(0, 5), [markets]);

  const trending = useMemo(() => (markets || []).filter(Boolean).sort((a, b) => b.volume24 - a.volume24).slice(0, 5), [markets]);

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Your simulated crypto portfolio overview</p>
      </GlassCard>

      <div className="grid grid-4">
        <MetricCard
          label="Portfolio Value"
          value={'$' + portfolio.totalValue.toLocaleString()}
          subtitle={'Base: $' + portfolio.totalBase.toLocaleString()}
          trend={portfolio.totalPl}
          trendLabel="PnL"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>}
          accent="#42DDAA"
          loading={loading}
        />
        <MetricCard
          label="Total PnL"
          value={plPercent >= 0 ? '+' : '' + plPercent.toFixed(2) + '%'}
          subtitle={'$' + totalPl.toFixed(2) + ' (' + '$' + totalBase.toFixed(2) + ' basis)'}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>}
          accent={plPercent >= 0 ? '#42DDAA' : '#FF657A'}
          loading={loading}
        />
        <MetricCard
          label="Holdings"
          value={holdings.length}
          subtitle={holdings.length + ' ' + (holdings.length === 1 ? 'asset' : 'assets') + ' held'}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
          accent="#C084FC"
          loading={loading}
        />
        <MetricCard
          label="Ready Cash"
          value={'$' + portfolio.totalValue.toLocaleString()}
          subtitle="Available for trading"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>}
          accent="#FF5CA8"
          loading={loading}
        />
      </div>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>BTC Price History</h3>
            <button className="btn btn--ghost btn--small" onClick={() => refresh()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a8 8 0 0 0-8-8 8 8 0 0 0-4.7 1.6L3 13v5h5"/></svg>
              Refresh
            </button>
          </div>
          <PriceChart data={priceHistory} title="BTC" height={200} />
        </GlassCard>

        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Top Gainers</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Asset</div>
                <div className="table-cell table-header-cell sortable">Price</div>
                <div className="table-cell table-header-cell sortable">24h Change</div>
              </div>
              {topGainers.map((a, i) => (
                <div key={a.id} className="table-row">
                  <div className="table-cell">{a.name}</div>
                  <div className="table-cell">${a.price.toFixed(4)}</div>
                  <div className={`table-cell text-${a.change24 >= 0 ? 'success' : 'danger'}`}>{a.change24 >= 0 ? '+' : ''}{a.change24.toFixed(2)}%</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-2" style={{ marginTop: '20px' }}>
        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Trending</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Asset</div>
                <div className="table-cell table-header-cell sortable">Price</div>
                <div className="table-cell table-header-cell sortable">Volume</div>
              </div>
              {trending.map((a, i) => (
                <div key={a.id} className="table-row">
                  <div className="table-cell">{a.name}</div>
                  <div className="table-cell">${a.price.toFixed(4)}</div>
                  <div className="table-cell">${a.volume24?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="card-chart">
          <div className="card-chart-header">
            <h3>Top Losers</h3>
          </div>
          <div className="table-wrapper">
            <div className="table">
              <div className="table-header">
                <div className="table-cell table-header-cell">Asset</div>
                <div className="table-cell table-header-cell sortable">Price</div>
                <div className="table-cell table-header-cell sortable">24h Change</div>
              </div>
              {topLosers.map((a, i) => (
                <div key={a.id} className="table-row">
                  <div className="table-cell">{a.name}</div>
                  <div className="table-cell">${a.price.toFixed(4)}</div>
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