import { useEffect, useMemo } from 'react';
import API from '../../services/localBackend';
import { GlassCard } from '../../components/common/GlassCard';
import { useApp } from '../../context/AppContext';

export default function VolumePage() {
  const { markets } = useApp();

  useEffect(() => { API.getMarkets(); }, []);

  const totalVol = useMemo(() => (markets || []).reduce((s, m) => s + (m.volume24 || 0), 0), [markets]);

  return (
    <div className="page-content">
      <GlassCard className="page-header"><h1>Volume Analytics</h1><p className="page-subtitle">Simulated 24h trading volume</p></GlassCard>
      <div className="grid grid-4"><div className="table-wrapper"><div className="table"><div className="table-row"><div className="table-cell">Total Volume (24h)</div><div className="table-cell">${(totalVol / 1e9).toFixed(2)}B</div></div></div></div></div>
      <GlassCard style={{ marginTop: '20px', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, margin: '0 auto', opacity: 0.4 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><h3>Volume charts coming soon</h3></GlassCard>
    </div>
  );
}
