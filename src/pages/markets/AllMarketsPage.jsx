import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function AllMarketsPage() {
  const { markets, watchlist } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  useEffect(() => { API.getMarkets(); }, []);

  const filtered = useMemo(() => {
    let list = markets.filter(Boolean);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      let cmp = sortBy === 'price' ? a.price - b.price : sortBy === 'change24' ? a.change24 - b.change24 : a.name.localeCompare(b.name);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [markets, query, sortBy, sortDir]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const rows = paged.map((a, i) => (
    <div key={a.id} className="table-row">
      <div className="table-cell">{(page - 1) * itemsPerPage + i + 1}</div>
      <div className="table-cell">{a.name}</div>
      <div className="table-cell">{a.symbol}</div>
      <div className="table-cell">${a.price.toFixed(4)}</div>
      <div className={`table-cell text-${a.change24 >= 0 ? 'success' : 'danger'}`}>{a.change24 >= 0 ? '+' : ''}{a.change24.toFixed(2)}%</div>
    </div>
  ));

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>All Markets</h1><p className="page-subtitle">{filtered.length} simulated assets</p></GlassCard>
      <GlassCard style={{ padding: '16px', maxWidth: '1200px', marginBottom: '20px' }}>
        <input type="text" placeholder="Search assets..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-card)' }} />
      </GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">#</div>
            <div className="table-cell table-header-cell">Asset</div>
            <div className="table-cell table-header-cell">Symbol</div>
            <div className="table-cell table-header-cell">Price</div>
            <div className="table-cell table-header-cell">24h Change</div>
          </div>
          {rows}
        </div>
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
          <button className="btn btn--ghost btn--small" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`btn btn--small ${p === page ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="btn btn--ghost btn--small" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
}
