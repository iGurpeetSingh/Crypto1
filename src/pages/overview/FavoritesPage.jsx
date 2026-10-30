import { useEffect, useState } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function FavoritesPage() {
  const { markets, watchlist } = useApp();
  const [faves, setFaves] = useState([]);
  const watchlistIds = watchlist.map((w) => w.assetId);

  useEffect(() => {
    const f = markets.filter((m) => watchlistIds.includes(m.id));
    setFaves(f);
  }, [markets, watchlistIds]);

  if (!faves.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header">
          <h1>Favorites</h1>
          <p className="page-subtitle">Your favorite simulated assets</p>
        </GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3>No favorites yet</h3>
          <p>Add assets to your favorites from the markets page.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Favorites</h1>
        <p className="page-subtitle">Your saved simulated assets from the market watchlist</p>
      </GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">24h Change</div>
            <div className="table-cell table-header-cell">Market Cap</div>
            <div className="table-cell table-header-cell">Actions</div>
          </div>
          {faves.map((a) => (
            <div key={a.id} className="table-row">
              <div className="table-cell">{a.name} ({a.symbol})</div>
              <div className="table-cell">${a.price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
              <div className={`table-cell text-${a.change24 >= 0 ? 'success' : 'danger'}`}>{a.change24 >= 0 ? '+' : ''}{a.change24.toFixed(2)}%</div>
              <div className="table-cell">${(a.marketCap / 1000000000).toFixed(2)}B</div>
              <div className="table-cell">
                <button className="btn btn--ghost btn--small">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
