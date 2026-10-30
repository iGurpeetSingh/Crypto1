import { useEffect } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function MarketCapPage() {
  const { markets } = useApp();

  useEffect(() => { API.getMarkets(); }, []);

  const totalMarketCap = useMemo(() => (markets || []).reduce((s, m) => s + m.marketCap, 0), [markets]);

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Market Cap</h1><p className="page-subtitle">Total simulated market capitalization across assets</p></GlassCard>
      <div className="grid grid-4"><div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Total Market Cap</div><div className="table-cell">${(totalMarketCap / 1e9).toFixed(2)}B</div></div></div></div></div>
      <GlassCard style={{ marginTop: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/></svg><h3>Market cap charts coming soon</h3></GlassCard>
    </div>
  );
}
