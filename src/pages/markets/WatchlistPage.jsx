import { useEffect } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function WatchlistPage() {
  const { watchlist, markets } = useApp();

  useEffect(() => { API.getMarkets(); }, []);

  const watched = useMemo(() => (markets || []).filter((m) => watchlist.some((w) => w.assetId === m.id)), [markets, watchlist]);

  if (!watched.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header"><h1>Watchlist</h1></GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg><h3>Your watchlist is empty</h3></GlassCard>
      </div>
    );
  }

  const rows = watched.map((m) => (
    <div key={m.id} className="table-row">
      <div className="table-cell">{m.name}</div>
      <div className="table-cell">{m.symbol}</div>
      <div className="table-cell">${m.price.toFixed(4)}</div>
      <div className={`table-cell text-${m.change24 >= 0 ? 'success' : 'danger'}`}>{m.change24 >= 0 ? '+' : ''}{m.change24.toFixed(2)}%</div>
    </div>
  ));

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Watchlist</h1><p className="page-subtitle">Your simulated watched assets</p></GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Symbol</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">24h</div>
          </div>
          {rows}
        </div>
      </div>
    </div>
  );
}
