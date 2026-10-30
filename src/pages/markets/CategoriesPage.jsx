import { useEffect, useMemo } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function CategoriesPage() {
  const { markets } = useApp();

  useEffect(() => { API.getMarkets(); }, []);

  const categories = useMemo(() => {
    const map = new Map();
    (markets || []).forEach((m) => {
      const cat = m.category || 'Other';
      const cur = map.get(cat) || { count: 0, totalVol: 0 };
      cur.count++;
      cur.totalVol += m.volume24 || 0;
      map.set(cat, cur);
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, count: data.count, vol: data.totalVol }));
  }, [markets]);

  if (!categories.length) {
    return (
      <div className="page-content">
        <GlassCard className="page-header"><h1>Categories</h1></GlassCard>
        <GlassCard style={{ minHeight: '200px' }}><h3>Loading categories...</h3></GlassCard>
      </div>
    );
  }

  const rows = categories.map((c) => (
    <div key={c.name} className="table-row">
      <div className="table-cell">{c.name}</div>
      <div className="table-cell">{c.count}</div>
      <div className="table-cell">${(c.vol / 1e9).toFixed(2)}B</div>
    </div>
  ));

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Market Categories</h1><p className="page-subtitle">Explore assets grouped by category</p></GlassCard>
      <div className="table-wrapper">
        <div className="table">
          <div className="table-header">
            <div className="table-cell table-header-cell">Category</div>
            <div className="table-cell table-header-cell">Assets</div>
            <div className="table-cell table-header-cell">Volume (24h)</div>
          </div>
          {rows}
        </div>
      </div>
    </div>
  );
}
