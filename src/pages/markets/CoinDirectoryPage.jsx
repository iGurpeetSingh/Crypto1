import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function CoinDirectoryPage() {
  const { markets } = useApp();
  const navigate = useNavigate();

  useEffect(() => { API.getMarkets(); }, []);

  const coins = useMemo(() => (markets || []).map((m) => ({ ...m, category: m.category || 'Cryptocurrency' })), [markets]);

  if (!coins.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header"><h1>Coin Directory</h1></GlassCard>
        <GlassCard style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><h3>Loading coins...</h3></GlassCard>
      </div>
    );
  }

  return (
    <div className="page-content">
      <GlassCard className="page-header">
        <h1>Coin Directory</h1>
        <p className="page-subtitle">Browse all simulated cryptocurrency assets</p>
      </GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Symbol</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">24h</div>
            <div className="table-cell table-header-cell">Category</div>
          </div>
          {coins.map((c) => (
            <div key={c.id} className="table-row">
              <div className="table-cell">{c.name}</div>
              <div className="table-cell">{c.symbol}</div>
              <div className="table-cell">${c.price.toFixed(4)}</div>
              <div className={`table-cell text-${c.change24 >= 0 ? 'success' : 'danger'}`}>{c.change24 >= 0 ? '+' : ''}{c.change24.toFixed(2)}%</div>
              <div className="table-cell">{c.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
